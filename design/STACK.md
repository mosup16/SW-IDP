# SW-IDP — Locked stack & topology

This is the **single source of truth** for the SW-IDP stack and runtime topology. It supersedes:

- §7 ("Implied dependencies") of `REQUIREMENTS.md` (originally drafted around Next.js + shadcn).
- The "Next.js Web App + BFF" topology in the original `ARCHITECTURE.md` (now replaced by SPA + Gateway).

Any issue in the tracker that needs to know "what stack" or "which library" links here. The stack is **not** restated inside individual issues.

---

## Topology

```
                          ┌──────────────────────────┐
Browser  ──HTTPS──▶       │   Spring Cloud Gateway   │
                          └────┬─────────────────────┘
                               │
                  ┌────────────┼─────────────┐
                  ▼            ▼             ▼
          identity-service  oauth-service  admin-service
                  │            │             │
                  └────────────┼─────────────┘
                               ▼
                  Postgres (single instance)
                  schemas: identity / oauth / admin

3rd-party Client App ── /authorize, /token ──▶ Gateway ──▶ oauth-service

Eureka         ◀── registers ── identity / oauth / admin / gateway
Config Server  ── serves config to ── identity / oauth / admin / gateway
```

**The React SPA talks only to the Gateway.** There is no separate BFF. Inter-service calls also go through service discovery (Eureka), not through the Gateway.

---

## Frontend

| Concern | Choice |
|---|---|
| Build / dev server | **Vite** |
| Framework | **React 18+** |
| Language | **TypeScript** |
| Routing | **React Router v6** |
| Server state | **TanStack Query v5** |
| Styling | **Tailwind v4** with the Material-3 tokens in `REQUIREMENTS.md` §5 + `stitch-export/aegis_core/DESIGN.md` |
| Icons | **lucide-react** (Material Symbols → Lucide mapping in `REQUIREMENTS.md` §10) |
| Forms / validation | **react-hook-form + zod** |
| Component primitives | shadcn-style locally-owned primitives (Button, Input, Card, Modal, Dialog, AlertDialog, Tabs, Select, DropdownMenu) — built once in `epic:foundation` |

The SPA lives at `apps/web/` and is the only frontend artefact.

---

## Backend

| Concern | Choice |
|---|---|
| Language | **Java 21** |
| Framework | **Spring Boot 3.x** |
| Build | **Maven multi-module** — one parent `pom.xml`, one module per service |
| Persistence | **Spring Data JPA** on Postgres |
| Migrations | **Flyway**, one migration history per service (each service writes only to its own schema) |
| Inter-service RPC | **OpenFeign** over HTTP/JSON |
| Internal-call auth | Shared header secret (`X-Internal-Auth: <secret>`), value pulled from Config Server |
| Web security | **Spring Security**, role-based access on admin routes |
| End-user session | Opaque server-side session backed by the `Session` entity in `ERD.md` (matches the original architecture decision) |

---

## Spring Cloud

| Component | Role |
|---|---|
| **Eureka** | Service discovery for all four runtime apps (gateway + 3 services) |
| **Config Server** | Centralised config; each service pulls on startup |
| **Spring Cloud Gateway** | Edge router. Replaces the original "Next.js BFF" idea entirely. |

Gateway routes (final list confirmed in foundation issue):

- `/api/identity/**` → identity-service
- `/api/oauth/**`    → oauth-service (also serves the public OAuth endpoints — `/oauth/authorize`, `/oauth/token`, `/userinfo`, `/.well-known/openid-configuration`, JWKS)
- `/api/admin/**`    → admin-service

---

## Repo layout (locked)

```
SW-IDP/
├── apps/
│   └── web/                  # Vite + React SPA (TypeScript)
├── services/
│   ├── identity-service/     # Spring Boot, owns identity.* schema
│   ├── oauth-service/        # Spring Boot, owns oauth.* schema
│   ├── admin-service/        # Spring Boot, owns admin.* schema
│   ├── gateway/              # Spring Cloud Gateway
│   ├── eureka/               # Eureka server
│   └── config-server/        # Spring Cloud Config Server
├── packages/
│   └── shared-types/         # OpenAPI-derived TS types for the SPA
├── pom.xml                   # Maven parent
├── infra/
│   └── docker-compose.yaml   # Postgres + 6 Spring containers + web (dev only)
└── design/
```

The six Spring apps share one Maven parent so dependency versions and plugin config live in one place.

---

## Database

- **One Postgres instance**, three schemas: `identity`, `oauth`, `admin`.
- Each service owns its schema and writes only there.
- Cross-schema IDs are carried by value — **no foreign keys** crossing schemas. (Matches `ARCHITECTURE.md` §3.)

---

## Out of scope (locked)

These are not in the PoC. Issues must not introduce them.

- **PKCE.** OAuth code flow does not support PKCE. The `AuthorizationCode` entity does not carry `code_challenge` / `code_challenge_method`.
- **Access Policies.** No `AccessPolicy` entity, no `policies-ui`, no admin-service policy endpoints. Policy-shaped requirements are absorbed by role management (`roles-ui` + identity-service role assignment). The `admin_access_policies_*` Stitch screens are not ported.
- **OAuth scopes.** Not implemented. No `Scope` entity, no per-client allowlist, no scopes claim on tokens.
- **Event bus, KMS / Vault for signing keys, service mesh, mTLS, distributed tracing, DB-per-service.** Cuts inherited from `ARCHITECTURE.md` §8 still apply.

---

## Decisions deferred to the foundation phase

These are open and will be pinned during `epic:foundation`. Issues should NOT pre-empt them.

1. Password-hash algorithm (bcrypt vs argon2).
2. JWT signing-key strategy (file-mounted keypair vs env-injected; JWKS shape).
3. Local-dev seed strategy for Postgres (Flyway dev-only migration vs separate seed script).
4. Exact Lucide ↔ Material Symbols final mapping (preview in `REQUIREMENTS.md` §10).

---

## Where to look when an issue is ambiguous

| Kind of question | Doc |
|---|---|
| Which library / framework / topology | **this file** |
| What does the screen look like | `design/stitch-export/stitch_system_user_interface/<screen>/index.html` |
| What entities / fields / relationships | `design/ERD.md` |
| What service owns this endpoint | `design/ARCHITECTURE.md` §1 |
| What design tokens / typography | `design/REQUIREMENTS.md` §5 + `stitch-export/aegis_core/DESIGN.md` |
| What the original product asks for | `design/REQUIREMENTS.md` §1 + the SRS in `stitch-export/.../srs_poc_identity_provider_idp.txt` |
