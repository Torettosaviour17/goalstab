# GoalTabs payment socket (provider-independent foundation)

This directory contains a **non-activated** adapter registry, money validation and payment engine. No gateway is installed and no money can move through this module yet.

## Adapter contract

A provider adapter implements:
- `supports({ currency, operation }) => boolean`
- `initialize({ amountMinor, currency, reference, customer, metadata }) => Promise<providerCheckout>`
- `verify({ reference }) => Promise<verifiedProviderResult>`
- `verifyWebhook({ rawBody, headers }) => Promise<verifiedProviderEvent>`

Adapters must validate provider credentials and signatures. The backend must independently compare verified provider reference, amount, currency and ownership with a server-created payment intent. Never trust browser success callbacks, provider metadata alone, or unverified webhook payloads.

## Production integration still required

1. Define persisted payment intents, immutable provider events, idempotency keys and unique provider/reference constraints.
2. Implement a single atomic posting path into the ledger, including pending, available, goal-allocated and payout-reserved balances, with reconciliation.
3. Add provider adapters and a secure raw-body webhook route; enforce per-provider supported methods, regions, currencies and runtime feature flags.
4. Implement refunds, chargebacks, reversals, settlement reconciliation, operational alerts, and compliance controls.
5. Migrate and reconcile legacy direct goal credits and withdrawals before enabling any wallet funding.

**Safety:** `/api/wallet/fund`, `/transfer`, `/withdraw` and `/save` remain disabled. Existing legacy Paystack goal payment endpoints are separate and must be audited before production use. No secrets belong in source control.
