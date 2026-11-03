"use strict";

// Provider-neutral money representation. Never use floating-point major units
// for accounting. The exponent is currency-specific, not provider-specific.
const EXPONENTS = Object.freeze({ NGN: 2, USD: 2, EUR: 2, GBP: 2, JPY: 0, KWD: 3 });
function normalizeCurrency(currency) {
  if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) throw new TypeError("Invalid ISO currency");
  if (!Object.prototype.hasOwnProperty.call(EXPONENTS, currency)) throw new RangeError("Unsupported currency");
  return currency;
}
function validateMoney({ amountMinor, currency }) {
  const code = normalizeCurrency(currency);
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) throw new RangeError("Amount must be a positive safe integer in minor units");
  return Object.freeze({ amountMinor, currency: code });
}
module.exports = { EXPONENTS, normalizeCurrency, validateMoney };
