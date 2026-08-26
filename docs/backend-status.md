# Backend status

## Sprint 0

- NestJS foundation: implemented
- PostgreSQL/Prisma schema: implemented
- Redis/BullMQ dependencies and Compose service: configured; no feature queues yet
- Environment validation: implemented
- Correlation ID: implemented
- Global success/error response shapes: implemented
- Swagger/OpenAPI generation: implemented
- Security DTO and enums: implemented
- Synthetic seed data: implemented
- Contract CI gates: implemented
- Feature logic: intentionally not started

## Sprint 1 — Auth + Current User integration package

- `POST /auth/register`: implemented
- `POST /auth/login`: implemented with account-enumeration-resistant errors
- `POST /auth/refresh`: implemented with atomic refresh-token rotation
- `POST /auth/logout`: implemented with session revocation
- `GET /me`: implemented with bearer authentication and RBAC role
- Password hashing: Argon2id
- Access tokens: short-lived JWT
- Refresh tokens: opaque random secret with SHA-256 hash stored server-side
- Sessions and audit events: persisted through Prisma
- Broad feature logic: intentionally not started

Runtime infrastructure requires Docker or compatible PostgreSQL/Redis services. The health endpoint does not depend on those services in Sprint 0.
