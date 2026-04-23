/** Hook server startup — Sentry / OpenTelemetry (master plan). */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Reserved for prod observability.
  }
}
