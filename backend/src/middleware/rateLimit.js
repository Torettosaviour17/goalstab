"use strict";

// Per-process safeguard for authentication endpoints. For multi-instance
// deployments use a shared Redis-backed limiter at the gateway instead.
function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 20 } = {}) {
  const buckets = new Map();
  return function rateLimit(req, res, next) {
    const now = Date.now();
    // Trust Express's req.ip, not client-supplied X-Forwarded-For.
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const current = buckets.get(ip);
    const bucket = !current || now >= current.resetAt
      ? { count: 0, resetAt: now + windowMs }
      : current;
    bucket.count += 1;
    buckets.set(ip, bucket);
    // Bound memory even when receiving many distinct client addresses.
    if (buckets.size > 10000) {
      for (const [key, value] of buckets) {
        if (now >= value.resetAt) buckets.delete(key);
      }
      if (buckets.size > 10000) buckets.delete(buckets.keys().next().value);
    }
    if (bucket.count > max) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))));
      return res.status(429).json({ msg: "Too many attempts. Please try again later." });
    }
    next();
  };
}
module.exports = { createRateLimiter };
