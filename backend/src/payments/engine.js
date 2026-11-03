"use strict";
const { validateMoney } = require("./money");

// This engine is intentionally independent of Express, MongoDB and provider SDKs.
// No public funding endpoint is wired until verified settlement + ledger posting
// and reconciliation are implemented and reviewed.
class PaymentEngine {
  constructor({ registry }) {
    if (!registry) throw new TypeError("Provider registry required");
    this.registry = registry;
  }
  async initialize({ provider, amountMinor, currency, reference, customer, metadata = {} }) {
    const money = validateMoney({ amountMinor, currency });
    if (typeof reference !== "string" || !/^[a-zA-Z0-9_-]{8,128}$/.test(reference)) throw new TypeError("Invalid reference");
    if (!customer || typeof customer !== "object") throw new TypeError("Customer required");
    const adapter = this.registry.get(provider);
    if (typeof adapter.supports !== "function" || !adapter.supports({ currency: money.currency, operation: "collection" })) {
      throw new Error("Provider does not support this operation and currency");
    }
    return adapter.initialize({ ...money, reference, customer, metadata });
  }
  async verify({ provider, reference }) {
    if (typeof reference !== "string" || !/^[a-zA-Z0-9_-]{8,128}$/.test(reference)) throw new TypeError("Invalid reference");
    return this.registry.get(provider).verify({ reference });
  }
  async verifyWebhook({ provider, rawBody, headers }) {
    if (!Buffer.isBuffer(rawBody)) throw new TypeError("Raw webhook body required");
    return this.registry.get(provider).verifyWebhook({ rawBody, headers });
  }
}
module.exports = { PaymentEngine };
