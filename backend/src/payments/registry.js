"use strict";

// Payment providers are plugged in here. Registration alone never enables
// a payment method: explicit capabilities and runtime configuration are required.
const REQUIRED = ["initialize", "verify", "verifyWebhook"];
class PaymentProviderRegistry {
  constructor() { this.providers = new Map(); }
  register(name, adapter) {
    if (typeof name !== "string" || !/^[a-z][a-z0-9_-]*$/.test(name)) throw new TypeError("Invalid provider name");
    if (!adapter || REQUIRED.some(method => typeof adapter[method] !== "function")) throw new TypeError("Incomplete payment adapter");
    if (this.providers.has(name)) throw new Error("Provider already registered");
    this.providers.set(name, adapter);
    return this;
  }
  get(name) {
    const provider = this.providers.get(name);
    if (!provider) throw new Error("Payment provider unavailable");
    return provider;
  }
  list() { return [...this.providers.keys()]; }
}
module.exports = { PaymentProviderRegistry };
