"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateMoney } = require("../money");
const { PaymentProviderRegistry } = require("../registry");
const { PaymentEngine } = require("../engine");

test("minor units and currency validation reject invalid money", () => {
  assert.deepEqual(validateMoney({ amountMinor: 10000, currency: "NGN" }), { amountMinor: 10000, currency: "NGN" });
  assert.throws(() => validateMoney({ amountMinor: 0, currency: "NGN" }));
  assert.throws(() => validateMoney({ amountMinor: 1.5, currency: "NGN" }));
  assert.throws(() => validateMoney({ amountMinor: 100, currency: "XYZ" }));
});
test("socket refuses absent providers and unsupported currencies", async () => {
  const registry = new PaymentProviderRegistry();
  const engine = new PaymentEngine({ registry });
  const request = { provider: "mock", amountMinor: 10000, currency: "NGN", reference: "test_ref_1234", customer: { id: "user" } };
  await assert.rejects(engine.initialize(request), /unavailable/);
  registry.register("mock", {
    supports: ({ currency }) => currency === "NGN",
    initialize: async ({ reference }) => ({ reference, checkoutUrl: "https://example.test/checkout" }),
    verify: async ({ reference }) => ({ reference, status: "pending" }),
    verifyWebhook: async () => ({ status: "ignored" }),
  });
  assert.equal((await engine.initialize(request)).reference, request.reference);
  await assert.rejects(engine.initialize({ ...request, currency: "EUR" }), /does not support/);
  assert.throws(() => registry.register("mock", {}), /Incomplete/);
});
test("webhook verification requires raw bytes", async () => {
  const engine = new PaymentEngine({ registry: new PaymentProviderRegistry() });
  await assert.rejects(engine.verifyWebhook({ provider: "mock", rawBody: "not bytes", headers: {} }), /Raw webhook body/);
});
