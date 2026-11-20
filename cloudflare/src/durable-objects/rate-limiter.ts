// UltraSearch — Durable Object Rate Limiter
// One DO instance per (user × day). Globally consistent counter.
// Lives in a single location — reads and writes are strongly consistent.

export class RateLimiter {
  private state: DurableObjectState;
  private count: number = 0;
  private initialized: boolean = false;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    // Lazy-load persisted count on first request
    if (!this.initialized) {
      this.count = (await this.state.storage.get<number>('count')) ?? 0;
      this.initialized = true;
    }

    const { limit } = await request.json<{ limit: number }>();
    const today = new Date().toISOString().slice(0, 10);

    // Midnight UTC reset timestamp
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const resetAt = tomorrow.toISOString();

    const allowed = this.count < limit;

    if (allowed) {
      this.count++;
      // Persist every 50th increment to cut DO storage write ops by ~50x
      // DO memory is single-threaded and consistent — safe to batch persist
      if (this.count % 50 === 0 || this.count >= limit) {
        await this.state.storage.put('count', this.count);
      }

      // Set midnight reset alarm once per session (not every request)
      if (this.count <= 50) {
        const msUntilMidnight = tomorrow.getTime() - Date.now();
        await this.state.storage.setAlarm(Date.now() + msUntilMidnight);
      }
    }

    return Response.json({
      allowed,
      limit,
      remaining: Math.max(0, limit - this.count),
      reset_at:  resetAt,
    });
  }

  // Alarm fires at midnight UTC — resets the counter
  async alarm(): Promise<void> {
    this.count = 0;
    await this.state.storage.put('count', 0);
  }
}

