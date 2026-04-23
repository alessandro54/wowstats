precision highp float;
uniform float uT;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uDark;
varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  vec2 a = hash2(i), b = hash2(i + vec2(1, 0)), c = hash2(i + vec2(0, 1)), d = hash2(i + vec2(1, 1));
  return mix(
    mix(dot(a * 2.0 - 1.0, f), dot(b * 2.0 - 1.0, f - vec2(1, 0)), u.x),
    mix(dot(c * 2.0 - 1.0, f - vec2(0, 1)), dot(d * 2.0 - 1.0, f - vec2(1, 1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5;
  v += a * noise(p); p = p * 2.03 + vec2(5.2, 1.3); a *= 0.5;
  v += a * noise(p);
  return v / 0.875;
}

void main() {
  vec2 uv = vUv;
  uv.x *= uRes.x / uRes.y;
  uv += uMouse * 0.02;

  float t = uT * 0.07;
  vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(5.2, 1.3)));
  vec2 r = vec2(
    fbm(uv + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(uv + 3.0 * q + vec2(8.3, 2.8) + 0.126 * t)
  );
  float f = fbm(uv + 3.0 * r);
  f = f * 0.5 + 0.5;

  vec3 dCol = mix(vec3(0.02, 0.005, 0.005), vec3(0.45, 0.07, 0.01), clamp(f * 2.0, 0.0, 1.0));
  dCol = mix(dCol, vec3(0.75, 0.22, 0.03), clamp(f * f * 3.5, 0.0, 1.0));
  dCol *= 0.35;

  vec3 lCol = mix(vec3(0.96, 0.94, 0.92), vec3(0.90, 0.86, 0.82), clamp(f * 2.0, 0.0, 1.0));
  lCol = mix(lCol, vec3(0.85, 0.78, 0.70), clamp(f * f * 2.0, 0.0, 1.0));

  vec3 col = mix(lCol, dCol, uDark);

  vec2 vPos = vUv * 2.0 - 1.0;
  float vig = mix(0.25, 0.55, uDark);
  col *= 1.0 - vig * dot(vPos, vPos);

  gl_FragColor = vec4(col, 1.0);
}
