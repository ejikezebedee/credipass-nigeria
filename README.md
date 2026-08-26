# CrediPass Nigeria

OpenAPI-first monorepo foundation for a consent-led credit passport platform. Sprint 0 establishes contracts, DTO standards, security boundaries, infrastructure, and CI enforcement; it intentionally contains no feature logic.

## Ownership

- Emeka: backend, database, OpenAPI contract, security, compliance, risk engine, consent enforcement, audit logging, and integration gate.
- Qwen: frontend routes, UI/UX, components, dashboard experience, responsive design, and API client generated from the OpenAPI contract.

## Local development

```bash
cp .env.example .env
npm install
docker compose up -d postgres redis
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

- Health: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/docs`

## Contract workflow

1. Update backend DTOs/controllers.
2. Add or update the operation example in `docs/api-examples.md`.
3. Run `npm run contract:generate`.
4. Commit `docs/openapi.json` and `packages/shared-types/src/generated/openapi.ts` together.
5. Run `npm run ci` before opening a pull request.

The contract gate fails if OpenAPI or generated frontend types are stale, examples are missing, type checks fail, tests fail, or builds fail.

## Security baseline

- Never expose raw BVN/NIN fields in public DTOs, logs, examples, or seed data.
- Consent is explicit and enforceable; it is never bypassed.
- Risk outputs are recommendations for human assessment, never automated approval or rejection.
- All responses include a request correlation ID for traceability.
