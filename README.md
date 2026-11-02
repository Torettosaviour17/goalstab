# GoalTabs

GoalTabs is a goal-based savings and financial planning application. Users can create savings goals for products, services, and other needs, track progress, manage linked bank accounts, and request withdrawals. An administrative interface supports operations and oversight.

## Architecture

- **Web client:** Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS.
- **Mobile/PWA:** Capacitor and Vite PWA support.
- **API:** Node.js, Express, MongoDB/Mongoose, JWT authentication and Google sign-in.
- **Payments:** Existing Paystack integration. Payment gateway redesign and additional providers are planned; do not assume that all financial flows are production-certified.
- **Hosting:** Vercel frontend and Render API (deployment configuration may vary).

## Local development

Install Node.js 22 and pnpm. Run `pnpm install` and `pnpm dev` at the repository root. In a separate terminal, install backend dependencies with `cd backend && npm install`, configure environment variables locally, then run `npm run dev`. Never commit secrets or real payment credentials.

The backend needs `MONGODB_URI` and `JWT_SECRET`. Google sign-in and payment operations require their respective provider credentials. Set `VITE_API_URL` to the backend API base URL for the frontend. See `backend/.env.example` for additional configuration.

## Quality checks

- Frontend: `pnpm type-check` and `pnpm build`.
- Backend: `cd backend && node --test test/*.test.js`.
- CI: `.github/workflows/ci.yml`.

## Production readiness

Before accepting live customer funds, verify payment signatures against the provider's raw webhook payload, idempotent crediting, withdrawal concurrency controls, ledger reconciliation, rate limiting across instances, backup and recovery, audit trails, and operational monitoring. Perform end-to-end tests with provider sandbox credentials.

## Branches

- `master`: production deployment branch.
- `chatgpt`: development and reviewed improvements. Merge only after successful checks.

## Current limitations

The authentication rate limiter is process-local. Replace it with a shared limiter (for example, Redis or an edge gateway) before running multiple API instances. Financial integrations and business compliance require a separate production audit.
