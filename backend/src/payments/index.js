"use strict";
const { PaymentProviderRegistry } = require("./registry");
const { PaymentEngine } = require("./engine");
const registry = new PaymentProviderRegistry();
const engine = new PaymentEngine({ registry });
module.exports = { registry, engine, PaymentProviderRegistry, PaymentEngine };
