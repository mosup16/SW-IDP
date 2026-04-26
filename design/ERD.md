# SW-IDP — Entity Relationship Diagrams

Derived from `design/REQUIREMENTS.md` (SRS + Stitch design). Four diagrams: a full-model overview, then three zoomed views.

Assumptions baked into the model:

- **Admin vs. end-user is a role, not a separate entity.** The SRS distinguishes "Identity" from "Identity Admin", but since the design already introduces RBAC with a `Global Administrator` role, admins are modelled as `Identity` rows that hold that role. This avoids duplicate user tables.
- **Tokens are stored for revocation/audit.** Access tokens are JWTs (self-contained), but we persist a row per issuance so "Rotate Secret", revoke-on-logout, and audit trails work.
- **`RedirectUri` is its own table** because `admin_create_edit_client` shows multiple URIs per client.
- **OAuth scopes are out of scope for the PoC.** No `Scope` entity, no per-client scope allowlist, no scopes field on tokens/codes. See `design/STACK.md` ("Out of scope").
- **Access Policies are out of scope.** No `AccessPolicy` entity, no policy table, no policy endpoints. Policy-shaped requirements are absorbed by role management (`Role` + `Permission` + `RolePermission`). See `STACK.md`.
- **PKCE is out of scope.** `AuthorizationCode` does not carry `code_challenge` / `code_challenge_method`. See `STACK.md`.
- Surrogate `uuid` PKs everywhere. Timestamps are `timestamptz`.

---

## 1. Full model — overview

```mermaid
erDiagram
    Identity ||--o{ Session : "has"
    Identity ||--o{ IdentityRole : "assigned"
    Role ||--o{ IdentityRole : "held by"
    Role ||--o{ RolePermission : "grants"
    Permission ||--o{ RolePermission : "in"
    Identity ||--o{ AuthorizationCode : "issued to"
    Identity ||--o{ AccessToken : "issued to"
    Identity ||--o{ RefreshToken : "issued to"
    Identity ||--o{ AuditLog : "actor of"
    ClientApplication ||--o{ RedirectUri : "allows"
    ClientApplication ||--o{ AuthorizationCode : "issues to"
    ClientApplication ||--o{ AccessToken : "issues to"
    ClientApplication ||--o{ RefreshToken : "issues to"
    AccessToken ||--o| RefreshToken : "paired with"
```

---

## 2. Identity & Access (RBAC + sessions)

```mermaid
erDiagram
    Identity {
        uuid id PK
        string email UK
        string password_hash
        string status "ENABLED | DISABLED"
        string display_name
        timestamptz registered_at
        timestamptz last_login_at
        timestamptz disabled_at "nullable"
    }

    Session {
        uuid id PK
        uuid identity_id FK
        string device_label "e.g. MacBook Pro - Safari"
        string user_agent
        inet ip_address
        string location "resolved from IP"
        timestamptz created_at
        timestamptz last_active_at
        timestamptz revoked_at "nullable"
        boolean is_current "derived"
    }

    Role {
        uuid id PK
        string name UK "e.g. Global Administrator"
        string description
        string type "BUILT_IN | CUSTOM"
        timestamptz created_at
        timestamptz last_modified_at
    }

    Permission {
        uuid id PK
        string code UK "e.g. identity.create"
        string resource "identity | client | role | policy | audit | settings"
        string action "create | read | update | delete | rotate"
        string description
    }

    IdentityRole {
        uuid identity_id PK,FK
        uuid role_id PK,FK
        timestamptz assigned_at
        uuid assigned_by FK "admin Identity"
    }

    RolePermission {
        uuid role_id PK,FK
        uuid permission_id PK,FK
    }

    Identity ||--o{ Session : "opens"
    Identity ||--o{ IdentityRole : "has"
    Role ||--o{ IdentityRole : "assigned to"
    Role ||--o{ RolePermission : "includes"
    Permission ||--o{ RolePermission : "granted by"
```

---

## 3. OAuth 2.0 Authorization Server

```mermaid
erDiagram
    ClientApplication {
        uuid id PK "client_id"
        string name "Application Name"
        string description
        string client_secret_hash
        string status "ACTIVE | DISABLED"
        timestamptz created_at
        timestamptz secret_rotated_at
        uuid created_by FK "admin Identity"
    }

    RedirectUri {
        uuid id PK
        uuid client_id FK
        string uri
    }

    AuthorizationCode {
        string code PK "opaque, single-use"
        uuid client_id FK
        uuid identity_id FK
        string redirect_uri "must match one in RedirectUri"
        timestamptz issued_at
        timestamptz expires_at "typically +60s"
        timestamptz used_at "nullable"
    }

    AccessToken {
        string jti PK "JWT id"
        uuid client_id FK
        uuid identity_id FK
        timestamptz issued_at
        timestamptz expires_at
        timestamptz revoked_at "nullable"
    }

    RefreshToken {
        uuid id PK
        string jti FK "paired AccessToken, nullable"
        uuid client_id FK
        uuid identity_id FK
        string token_hash
        timestamptz issued_at
        timestamptz expires_at
        timestamptz revoked_at "nullable"
    }

    ClientApplication ||--o{ RedirectUri : "registers"
    ClientApplication ||--o{ AuthorizationCode : "issued for"
    ClientApplication ||--o{ AccessToken : "issued for"
    ClientApplication ||--o{ RefreshToken : "issued for"
    AccessToken ||--o| RefreshToken : "paired"
```

---

## 4. Governance — Audit Logs, Settings

```mermaid
erDiagram
    AuditLog {
        uuid id PK
        timestamptz timestamp_utc
        uuid actor_id FK "Identity, nullable for system events"
        string action "e.g. identity.create, client.secret.rotate"
        string target_type "identity | client | role | policy | settings"
        string target_id
        string status "SUCCESS | FAILURE"
        inet ip_address
        jsonb metadata "request id, diff, etc."
    }

    SystemSetting {
        string key PK "access_token_ttl_mins | refresh_token_ttl_days | password_min_length | password_complexity | primary_color | company_logo_url"
        string value
        string type "int | string | bool | image"
        timestamptz updated_at
        uuid updated_by FK "Identity"
    }

    AuditLog }o--|| Identity : "performed by"
    SystemSetting }o--|| Identity : "last updated by"
```

---

## Field provenance (where each field came from)

| Entity | Fields backed by a screen / SRS |
|---|---|
| `Identity` | SRS §2.1 (email/password, enable/disable); `admin_identity_management` table columns (User Entity, Status, Registration Date, Access Control) |
| `Session` | `user_profile_sessions_2` table (Device/Application, Location (IP), Last Active, Action) |
| `Role` | `admin_role_management` (Role Name, Description, Type, Last Modified); `admin_create_edit_role` (Permissions picker) |
| `ClientApplication` + `RedirectUri` | `admin_create_edit_client` (Application Name, Redirect URIs, Client ID, Client Secret); `admin_client_management` table |
| `AuditLog` | `admin_audit_logs` table (Timestamp UTC, Actor, Action/Event, Status, IP Address) |
| `SystemSetting` | `admin_system_settings` (Access Token Expiration, Refresh Token Expiration, Password Complexity, Min Password Length, Primary Color, Company Logo) |
| `AuthorizationCode` / `AccessToken` / `RefreshToken` | SRS §2.2 (authorize + token endpoints, JWT) — fields are OAuth 2.0 spec standards |

## Open modelling questions

1. **Permission seeding.** Should `Permission` be a static enum in code (simpler) or a table you can grow from the UI (more flexible but needs a management screen that doesn't exist in the design)? Default: static enum, but tracked in DB so `RolePermission` FKs are valid.
2. ~~**PKCE.**~~ **Resolved: dropped.** See `design/STACK.md`.
3. **Multi-tenant?** Nothing in the SRS or design suggests tenants/orgs. Model assumes single-tenant.
4. ~~**Policy rules schema.**~~ **Resolved: AccessPolicy dropped from the PoC.** Policy-shaped requirements are absorbed by `Role` + `Permission`. See `STACK.md`.
