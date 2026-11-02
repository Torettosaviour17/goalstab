const test = require("node:test");
const assert = require("node:assert/strict");
const { createRateLimiter } = require("../src/middleware/rateLimit");

function invoke(middleware, ip) {
  const headers = {};
  let response;
  const req = { ip };
  const res = {
    setHeader(name, value) { headers[name] = value; },
    status(code) { response = { code }; return this; },
    json(body) { response.body = body; return this; },
  };
  let passed = false;
  middleware(req, res, () => { passed = true; });
  return { passed, response, headers };
}

test("allows requests within the configured limit", () => {
  const limiter = createRateLimiter({ max: 2 });
  assert.equal(invoke(limiter, "one").passed, true);
  assert.equal(invoke(limiter, "one").passed, true);
});

test("blocks excess requests with 429 and Retry-After", () => {
  const limiter = createRateLimiter({ max: 1 });
  invoke(limiter, "one");
  const result = invoke(limiter, "one");
  assert.equal(result.response.code, 429);
  assert.ok(Number(result.headers["Retry-After"]) > 0);
  assert.equal(invoke(limiter, "two").passed, true);
});

test("resets the count after the window", async () => {
  const limiter = createRateLimiter({ max: 1, windowMs: 5 });
  invoke(limiter, "one");
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(invoke(limiter, "one").passed, true);
});
