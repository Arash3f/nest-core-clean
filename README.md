# NestJS Core Clean

A production-oriented Clean Architecture starter built with NestJS, Prisma,
PostgreSQL, and TypeScript. It exposes the same domain through **REST** and
**GraphQL**, with JWT authentication, refresh-token rotation, role-based access
control, centralized error responses, validated configuration, Swagger and
Apollo tooling, Docker development, and unit/end-to-end tests.

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-E10098?logo=graphql&logoColor=white)](https://www.apollographql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Highlights

- Clean Architecture layers: domain, application (use cases), infrastructure, and presentation.
- Dual presentation: REST controllers and GraphQL resolvers share the same use cases.
- Signed access and refresh JWTs with independently configured expiration times.
- Refresh-token rotation with only the Argon2id hash stored in PostgreSQL.
- Device fingerprint binding on login/refresh to reduce token replay across clients.
- Self-service password change for logged-in users (`changeMyPassword`) plus admin password reset.
- Public member registration plus admin/member authorization guards.
- Immediate authorization checks against the current database role and active state.
- A single application error format with stable module-local codes and English/Persian messages.
- Strict DTO validation with transformation, allow-listing, rejection of unknown properties, and bounded password length (8–128).
- Prisma helpers for bounded pagination and sorting.
- Runtime validation of all required environment variables.
- Swagger UI and raw OpenAPI JSON outside production; code-first GraphQL schema at `schema.gql`.
- A committed Zeus GraphQL client, ready for tests after cloning.
- Auth endpoint throttling, database-backed health checks, boot-time development seeding, and Docker Compose.
- Jest unit and REST/GraphQL end-to-end coverage.

## Technology

| Area | Choice |
| --- | --- |
| Runtime | Node.js 22 |
| Framework | NestJS 11 / Express |
| Architecture | Clean Architecture (ports and adapters) |
| GraphQL | Apollo Server 5, `@nestjs/graphql` (code-first) |
| Language | TypeScript 5.9, strict mode |
| Database | PostgreSQL 15+ |
| Data access | Prisma 7 with the PostgreSQL driver adapter |
| Authentication | NestJS JWT and Argon2id |
| Validation | class-validator and class-transformer |
| API documentation | NestJS Swagger / OpenAPI |
| Typed GraphQL client | [graphql-zeus](https://github.com/graphql-editor/graphql-zeus) from `schema.gql` |
| Testing | Jest, ts-jest, Axios, Zeus |
| Tooling | pnpm, ESLint, Prettier, Husky, lint-staged |

## Architecture

```text
HTTP / GraphQL request
  -> global TokenGuard (optional JWT authentication)
  -> route/resolver guard (logged-in or admin authorization)
  -> global ValidationPipe
  -> Presentation (controller or resolver)
  -> Application use case
  -> Domain ports
  -> Infrastructure adapters (Prisma, JWT, Argon2)
  -> PostgreSQL

Any exception
  -> CoreExceptionFilter
  -> normalized JSON (REST) or GraphQL error extensions
```

```text
src/
|-- domain/                 Entities, value objects, ports, domain errors
|-- application/            Use cases and application ports
|-- infrastructure/         Prisma, config, seed, JWT/Argon2 adapters
|-- presentation/
|   |-- http/               REST controllers, guards, filters, DTOs
|   `-- graphql/            GraphQL resolvers and inputs
|-- app.module.ts           Root dependency graph
`-- main.ts                 Application bootstrap

tests/
|-- unit/                   Isolated use-case specs
|-- e2e/rest/               Auth, user, and health HTTP scenarios
|-- e2e/graphql/            Auth and user GraphQL scenarios
`-- utils/graphql/          Committed Zeus client generated from schema.gql
```

## API

### REST

Swagger is available outside production at `/api_docs` by default. The raw OpenAPI
document is served at `/docs` by default.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Process and database readiness |
| `POST` | `/auth/logIn` | Public, throttled | Create an access/refresh token pair |
| `POST` | `/auth/register` | Public, throttled | Register a member and sign in |
| `POST` | `/auth/refreshToken` | Public, throttled | Rotate a valid refresh token |
| `POST` | `/auth/logout` | Logged in | Revoke the stored refresh token |
| `PATCH` | `/auth/changePassword` | Admin | Replace a user's password and revoke refresh access |
| `PATCH` | `/auth/changeMyPassword` | Logged in | Replace the caller's password after verifying the current one |
| `GET` | `/user/me` | Logged in | Read the current profile |
| `POST` | `/user/updateMe` | Logged in | Change the current user's name or username |
| `GET` | `/user` | Admin | Filter, sort, and paginate users |
| `POST` | `/user/createUser` | Admin | Create a member or admin |
| `POST` | `/user/updateUser` | Admin | Change profile, role, or active state |
| `DELETE` | `/user/:id` | Admin | Soft-delete a user and revoke refresh access |

`GET /user` supports these query parameters:

| Parameter | Type | Behavior |
| --- | --- | --- |
| `id` | UUID | Exact ID |
| `username` | string | Case-insensitive contains |
| `name` | string | Case-insensitive contains |
| `role` | `Admin` or `Member` | Exact role |
| `active` | boolean | Exact active state |
| `take` | number | Page size, from 0 through 200; default 10 |
| `skip` | number | Offset, minimum 0; default 0 |
| `sortField` | string | A scalar field from the Prisma user model |
| `sortDescending` | boolean | Descending by default |

Example:

```http
GET /user?role=Member&active=true&take=20&skip=0&sortField=username&sortDescending=false
Authorization: Bearer <access-token>
```

### GraphQL

GraphQL is served at `/graphql`. Outside production, Apollo Sandbox / introspection is
available at the same path. The committed schema lives at `schema.gql`.

| Operation | Type | Access | Purpose |
| --- | --- | --- | --- |
| `me` | Query | Logged in | Read the current profile |
| `readUsers` | Query | Admin | Filter, sort, and paginate users |
| `logIn` | Mutation | Public, throttled | Create an access/refresh token pair |
| `register` | Mutation | Public, throttled | Register a member and sign in |
| `refreshToken` | Mutation | Public, throttled | Rotate a valid refresh token |
| `logout` | Mutation | Logged in | Revoke the stored refresh token |
| `changeMyPassword` | Mutation | Logged in | Replace the caller's password after verifying the current one |
| `changePassword` | Mutation | Admin | Replace a user's password and revoke refresh access |
| `updateMe` | Mutation | Logged in | Change the current user's name or username |
| `createUser` | Mutation | Admin | Create a member or admin |
| `updateUser` | Mutation | Admin | Change profile, role, or active state |
| `deleteUser` | Mutation | Admin | Soft-delete a user and revoke refresh access |

Example:

```graphql
query {
  readUsers(
    where: { role: Member, active: true }
    pagination: { take: 20, skip: 0 }
    sortBy: { field: "username", descending: false }
  ) {
    count
    data {
      id
      username
      role
    }
  }
}
```

### Shared responses

The health response includes database readiness:

```json
{
  "status": "ok",
  "database": "ok",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

Domain and framework errors are normalized. Domain errors also carry a Persian
translation and a stable `(module, code)` pair:

```json
{
  "path": "/auth/logIn",
  "statusCode": 400,
  "module": "AuthModule",
  "code": 4,
  "message": "The username or password is incorrect",
  "persianTranslation": "...",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

GraphQL delivers the same body inside error `extensions`. Debug and developer fields
are removed in production. Unexpected internal errors also receive a generic
production message.

## Authentication model

1. Login or registration issues an access token and a longer-lived refresh token.
2. Both tokens contain the user ID and username and are verified with the configured JWT secret.
3. The global token guard verifies a bearer token and attaches the authenticated user to the request when valid.
4. Route/resolver guards query the database to enforce the user's current active state and role.
5. Refresh validates the JWT, current user state, device fingerprint, and stored Argon2id hash before rotating the pair.
6. Logout, password replacement (admin or self-service), and soft deletion clear the stored refresh-token hash.

The current schema stores one refresh-token hash per user, so a later login replaces the
previous refresh session. Access tokens are stateless and remain valid until expiry unless
the user is deactivated. Use TLS everywhere and keep access-token lifetimes short.

Default auth throttling uses `THROTTLE_TTL_MS` / `THROTTLE_LIMIT`. Login and register also
apply stricter GraphQL per-operation limits. Throttling is skipped automatically in the
`test` environment.

## Getting started

### Prerequisites

- Node.js 22
- pnpm 10
- PostgreSQL 15 or newer, unless using Docker
- Docker Engine with Compose, for the container workflow

### Local development

```bash
git clone https://github.com/Arash3f/nestJs-core-clean.git
cd nestJs-core-clean
pnpm install --frozen-lockfile
cp .env.sample .env.dev
```

Set `NODE_ENV=development`, replace `JWT_SECRET`, configure the database values, and review
all seed credentials in `.env.dev`. Never deploy the sample admin/member passwords.

```bash
pnpm run prisma:generate:dev
pnpm run prisma:migrate:dev
pnpm run start:dev
```

Default local URLs:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api_docs`
- OpenAPI JSON: `http://localhost:3000/docs`
- GraphQL: `http://localhost:3000/graphql`
- Health: `http://localhost:3000/health`

### Docker development

```bash
cp docker/develop/.env.docker.dev.sample docker/develop/.env.docker.dev
cp docker/develop/.docker.dev.sample.env docker/develop/.docker.dev.env
```

Fill both files, ensuring the PostgreSQL credentials and database name match. In the
application URL, the database host must remain `postgres`, the Compose service name.

```bash
docker compose -f docker/develop/docker-compose-develop.yml up -d --build
```

The API is exposed at `http://localhost:3006`, PostgreSQL at host port `5436`, Swagger at
`http://localhost:3006/api_docs`, GraphQL at `http://localhost:3006/graphql`, and health at
`http://localhost:3006/health`.

```bash
docker compose -f docker/develop/docker-compose-develop.yml logs -f
docker compose -f docker/develop/docker-compose-develop.yml down
```

To intentionally remove the development database volume as well:

```bash
docker compose -f docker/develop/docker-compose-develop.yml down -v
```

## Environment variables

The application fails fast when a required value is missing or has the wrong primitive type.
The full templates are `.env.sample` and `.env.test.sample`.

| Group | Variables |
| --- | --- |
| Runtime | `NODE_ENV`, `SERVER_ADDRESS`, `SERVER_PORT` |
| Documentation | `SWAGGER_DOCS_PATH`, `SWAGGER_PATH` |
| Browser access | `CORS_ORIGINS` |
| Throttling | `THROTTLE_TTL_MS`, `THROTTLE_LIMIT` |
| JWT | `JWT_SECRET`, `jwtAccessExpire`, `jwtRefreshExpire` |
| Database | `DATABASE_CONNECTION_URL`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_PORT`, `DATABASE_HOST` |
| Seed | `SEED_ON_BOOT`, `SUPER_USER_*`, `MEMBER_USER_*` |
| Uploads | `UPLOAD_DIR` (reserved) |
| Password hashing | `PASSWORD_HASH_MEMORY_COST`, `PASSWORD_HASH_TIME_COST`, `PASSWORD_HASH_PARALLELISM` |

`NODE_ENV` must be one of `development`, `production`, or `test`. `jwtAccessExpire` and
`jwtRefreshExpire` are numeric seconds. `CORS_ORIGINS` accepts `*` or a comma-separated
list. Keep `SEED_ON_BOOT=false` in production unless startup seeding is deliberately
required.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm run start:dev` | Development server with webpack HMR and `.env.dev` |
| `pnpm run start:dev:swc` | Development watch mode with SWC |
| `pnpm run start:build` | Build with `.env.prod` |
| `pnpm run start:prod` | Run `dist/main.js` with `.env.prod` |
| `pnpm run prisma:generate:dev` | Generate the development Prisma client |
| `pnpm run prisma:migrate:dev` | Create/apply development migrations |
| `pnpm run prisma:studio:dev` | Open Prisma Studio |
| `pnpm run prisma:push:dev` | Push the schema without creating a migration |
| `pnpm run test` | Run all unit and end-to-end tests serially |
| `pnpm run test:cov` | Run all tests and create an HTML/lcov coverage report |
| `pnpm run lint` | Apply ESLint fixes |
| `pnpm run typecheck` | TypeScript `tsc --noEmit` |
| `pnpm run format` | Apply Prettier formatting |
| `pnpm run api` | Regenerate the Zeus client from `schema.gql` |
| `pnpm run swagger` | Generate the Axios/TypeScript client from a running development API |

## Testing

End-to-end suites start the real Nest application, use PostgreSQL, reset the configured
test database between cases, and call REST over HTTP plus GraphQL through the generated
Zeus client. Health is exercised over plain HTTP.

Prepare a dedicated disposable test database. Never point `.env.test` at development or
production data.

```bash
cp .env.test.sample .env.test
pnpm run prisma:generate:test
pnpm exec env-cmd -f ./.env.test pnpm exec prisma migrate deploy
```

The generated Zeus client under `tests/utils/graphql/` is committed, so a fresh clone can
compile and run tests without regenerating it first. Regenerate and commit it whenever
`schema.gql` changes:

```bash
pnpm run start:dev   # updates schema.gql from the code-first resolvers
pnpm run api         # regenerates the committed Zeus client
```

Optionally regenerate the Swagger TypeScript client after the documented API is up:

```bash
pnpm run swagger
```

Run the suite after the test database is prepared and the configured test port is free:

```bash
pnpm run test
pnpm run test:cov
```

Coverage produces an HTML report, `coverage/lcov.info` for Codecov, and a terminal summary.

Jest runs suites serially because each end-to-end suite binds the configured server port. A
busy port or unavailable database causes application setup to fail. The CI workflow
provisions PostgreSQL, generates the Prisma client, regenerates Zeus and verifies it matches
the committed files, then runs lint, typecheck, and tests.

## Production readiness notes

This project is a strong starter, not a complete production platform. Before deploying it
publicly:

- Add a production container/build target, deployment manifests, graceful shutdown, and a
  real secrets manager.
- Disable boot seeding and replace every sample credential and secret.
- Restrict CORS and configure proxy trust for the exact deployment topology.
- Add issuer/audience JWT claims, key rotation, and a session table if concurrent sessions
  are required.
- Add refresh-token reuse detection and an access-token revocation strategy where the risk
  model requires immediate logout.
- Tune GraphQL depth/complexity limits for your schema and traffic profile.
- Split unit and end-to-end commands, use dynamic test ports, and make failed setup/teardown
  safe.
- Add request IDs, structured logs, metrics/tracing, dependency scanning, and automated
  backups.
- Add account recovery, email verification, MFA, audit logs, and explicit account lockout
  according to product requirements.

## Contributing

1. Create a focused branch.
2. Add or update tests with the change.
3. Run Prisma generation, type checking, linting, and the relevant tests.
4. Use the configured gitmoji/Commitizen convention with `pnpm exec cz`.
5. Open a pull request against `develop` or `main`.

The pre-commit hook runs lint-staged for source TypeScript files. CI also validates pushes
and pull requests to `main` and `develop`.

## License

Released under the [MIT License](LICENSE).

## Author

Arash Alfooneh — [@Arash3f](https://github.com/Arash3f)
