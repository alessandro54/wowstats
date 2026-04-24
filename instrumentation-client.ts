import * as Sentry from "@sentry/nextjs"

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.01,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/api\.wowstats\.gg/,
  ],
})
