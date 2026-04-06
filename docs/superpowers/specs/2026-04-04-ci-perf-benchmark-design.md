# CI Performance Benchmark — Design Spec

**Goal:** Add bundle size budgets and Lighthouse CI to the project, gating PRs to `develop` and `main`. Consolidate CI into a single pipeline replacing the dead `staging-pipeline.yml`.

---

## Current State

- `staging-pipeline.yml` targets `staging` branch (dead — only `develop` and `main` exist)
- No performance benchmarking or bundle budgets
- Three.js chunk: 704KB (dynamically imported)
- Total static chunks: 1.9MB
- Playwright already a devDep

## Changes

### 1. Delete `.github/workflows/staging-pipeline.yml`

Dead code — targets a branch that doesn't exist.

### 2. Delete `.github/workflows/chromatic.yml`

Fold into the unified pipeline.

### 3. Create `.github/workflows/ci.yml`

Single pipeline for PRs to `develop` and `main`. Jobs:

| Job | Depends on | What it does |
|-----|-----------|--------------|
| `lint` | — | oxlint, stylelint, typecheck |
| `test` | `lint` | `pnpm test:unit` |
| `chromatic` | `lint` | Visual regression (Chromatic) |
| `perf` | `lint` | Bundle size check + Lighthouse CI |

`perf` job steps:
1. Checkout, setup pnpm + Node 22, install
2. `pnpm perf:size` — size-limit check
3. `pnpm build` — production build
4. `pnpm perf:lighthouse` — start server, run LHCI (3 runs, median)

### 4. Create `.size-limit.json`

```json
[
  {
    "path": ".next/static/chunks/*.js",
    "limit": "300 KB",
    "gzip": true,
    "name": "Homepage JS (all chunks)"
  }
]
```

Note: size-limit with `@size-limit/file` checks total gzipped size of matched files.

### 5. Create `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "pnpm start -p 9222",
      "startServerReadyPattern": "Ready",
      "url": ["http://localhost:9222/"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }],
        "total-blocking-time": ["error", { "maxNumericValue": 150 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 6. Update `package.json`

New scripts:
```json
{
  "perf:size": "size-limit",
  "perf:lighthouse": "lhci autorun"
}
```

New devDependencies:
- `size-limit`
- `@size-limit/file`
- `@lhci/cli`

### Local Usage

- `pnpm perf:size` — instant bundle size check
- `pnpm build && pnpm perf:lighthouse` — full Lighthouse audit with HTML report

## Thresholds

| Metric | Budget | Rationale |
|--------|--------|-----------|
| All JS chunks (gzip) | ≤ 300KB | Room to optimize Three.js imports later |
| Performance score | ≥ 95 | Push for best experience |
| LCP | ≤ 1.5s | Aggressive — fast first paint |
| CLS | ≤ 0.05 | Near-zero layout shift |
| TBT | ≤ 150ms | Minimal main thread blocking |

## Optimization: Three.js Tree-Shaking

Current: `await import("three")` pulls the entire library (175KB gzip, 704KB raw).

The component only uses 16 exports: `WebGLRenderer`, `Scene`, `OrthographicCamera`, `PerspectiveCamera`, `ShaderMaterial`, `PlaneGeometry`, `Mesh`, `BufferGeometry`, `BufferAttribute`, `Points`, `PointsMaterial`, `CanvasTexture`, `Vector2`, `AdditiveBlending`, `DynamicDrawUsage`.

**Fix:** Replace the barrel import with a selective dynamic import. Create a thin re-export module `src/lib/fx/three-imports.ts` that imports only what's needed:

```typescript
export {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PerspectiveCamera,
  ShaderMaterial,
  PlaneGeometry,
  Mesh,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  CanvasTexture,
  Vector2,
  AdditiveBlending,
  DynamicDrawUsage,
} from "three"
```

Then in `home-bg-canvas.tsx`: `const THREE = await import("@/lib/fx/three-imports")`.

The bundler can now tree-shake the rest of Three.js. Expected reduction: ~175KB → ~40-60KB gzip.

## Out of Scope

- Per-route budgets (only homepage for now)
- Real-device testing (Lighthouse uses emulated mobile)
- Performance monitoring in production (Vercel Speed Insights already handles this)
