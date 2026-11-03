"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { createPaystackAdapter } = require("../adapters/paystack");
test("Paystack verifies reference, currency and amount server-side", async () => {
  const adapter = createPaystackAdapter({ secretKey: "test-secret", http: {
    get: async () => ({ data: { status: true, data: { reference: "goal_test_123", amount: 50000, currency: "NGN", status: "success" } } }),
  } });
  assert.deepEqual(await adapter.verify({ reference: "goal_test_123" }), {
    provider: "paystack", reference: "goal_test_123", currency: "NGN", amountMinor: 50000, status: "success",
  });
  assert.equal(adapter.supports({ currency: "EUR", operation: "collection" }), false);
});
test("Paystack rejects forged and accepts signed webhook", async () => {
  const adapter = createPaystackAdapter({ secretKey: "test-secret" });
  const rawBody = Buffer.from(JSON.stringify({ event: "charge.success", data: { reference: "goal_test_123" } }));
  await assert.rejects(adapter.verifyWebhook({ rawBody, headers: { "x-paystack-signature": "bad" } }), /signature/);
  const signature = crypto.createHmac("sha512", "test-secret").update(rawBody).digest("hex");
  assert.equal((await adapter.verifyWebhook({ rawBody, headers: { "x-paystack-signature": signature } })).reference, "goal_test_123");
});
