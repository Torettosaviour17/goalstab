"use strict";
const axios = require("axios");
const crypto = require("node:crypto");
function createPaystackAdapter({ secretKey, http = axios }) {
  function headers() {
    if (!secretKey) throw new Error("Paystack credentials not configured");
    return { Authorization: "Bearer " + secretKey };
  }
  return {
    supports: ({ currency, operation }) => currency === "NGN" && operation === "collection",
    async initialize({ amountMinor, currency, reference, customer, metadata }) {
      if (currency !== "NGN" || !Number.isSafeInteger(amountMinor) || amountMinor <= 0 || !customer?.email) throw new Error("Invalid Paystack payment");
      const response = await http.post("https://api.paystack.co/transaction/initialize",
        { amount: amountMinor, currency, reference, email: customer.email, metadata },
        { headers: headers(), timeout: 15000 });
      const result = response.data?.data;
      if (response.data?.status !== true || result?.reference !== reference || !result.authorization_url) throw new Error("Invalid gateway response");
      return { provider: "paystack", reference, checkoutUrl: result.authorization_url };
    },
    async verify({ reference }) {
      const response = await http.get("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference),
        { headers: headers(), timeout: 15000 });
      const result = response.data?.data;
      if (response.data?.status !== true || result?.reference !== reference || result.currency !== "NGN" ||
          !Number.isSafeInteger(result.amount) || result.amount <= 0) throw new Error("Invalid verification");
      return { provider: "paystack", reference, currency: result.currency, amountMinor: result.amount,
        status: result.status === "success" ? "success" : "pending" };
    },
    async verifyWebhook({ rawBody, headers: incoming }) {
      if (!Buffer.isBuffer(rawBody)) throw new Error("Raw body required");
      const signature = incoming?.["x-paystack-signature"];
      const expected = crypto.createHmac("sha512", secretKey || "").update(rawBody).digest("hex");
      if (!secretKey || typeof signature !== "string" || !/^[0-9a-f]{128}$/i.test(signature) ||
          !crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) throw new Error("Invalid signature");
      const event = JSON.parse(rawBody.toString("utf8"));
      return { provider: "paystack", event: event.event, reference: event.data?.reference };
    },
  };
}
module.exports = { createPaystackAdapter };
