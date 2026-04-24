# SW-IDP — Entity Relationship Diagrams

Derived from `design/REQUIREMENTS.md` (SRS + Stitch design). Four diagrams: a full-model overview, then three zoomed views.

Assumptions baked into the model:

- **Admin vs. end-user is a role, not a separate entity.** The SRS distinguishes "Identity" from "Identity Admin", but since the design already introduces RBAC with a `Global Administrator` role, admins are modelled as `Identity` rows that hold that role. This avoids duplicate user tables.
- **Tokens are stored for revocation/audit.** Access tokens are JWTs (self-contained), but we persist a row per issuance so "Rotate Secret", revoke-on-logout, and audit trails work.
- **`RedirectUri` is its own table** because `admin_create_edit_client` shows multiple URIs per client.
- **Scopes** are a first-class entity (`openid`, `profile`, `email`, custom). Clients are allowlisted to scopes; access policies target scopes.
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
    ClientApplication ||--o{ ClientScope : "allowlist"
    Scope ||--o{ ClientScope : "granted to"
    ClientApplication ||--o{ AuthorizationCode : "issues to"
    ClientApplication ||--o{ AccessToken : "issues to"
    ClientApplication ||--o{ RefreshToken : "issues to"
    AccessToken ||--o| RefreshToken : "paired with"
    AccessPolicy ||--o{ AccessPolicyScope : "targets"
    Scope ||--o{ AccessPolicyScope : "governed by"
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

    Scope {
        uuid id PK
        string name UK "openid | profile | email | custom.*"
        string description
        boolean is_default
    }

    ClientScope {
        uuid client_id PK,FK
        uuid scope_id PK,FK
    }

    AuthorizationCode {
        string code PK "opaque, single-use"
        uuid client_id FK
        uuid identity_id FK
        string redirect_uri "must match one in RedirectUri"
        string scopes "space-separated"
        string code_challenge "PKCE, nullable"
        string code_challenge_method "S256 | plain"
        timestamptz issued_at
        timestamptz expires_at "typically +60s"
        timestamptz used_at "nullable"
    }

    AccessToken {
        string jti PK "JWT id"
        uuid client_id FK
        uuid identity_id FK
        string scopes
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
        string scopes
        timestamptz issued_at
        timestamptz expires_at
        timestamptz revoked_at "nullable"
    }

    ClientApplication ||--o{ RedirectUri : "registers"
    ClientApplication ||--o{ ClientScope : "allowed"
    Scope ||--o{ ClientScope : "granted to"
    ClientApplication ||--o{ AuthorizationCode : "issued for"
    ClientApplication ||--o{ AccessToken : "issued for"
    ClientApplication ||--o{ RefreshToken : "issued for"
    AccessToken ||--o| RefreshToken : "paired"
```

---

## 4. Governance — Access Policies, Audit Logs, Settings

```mermaid
erDiagram
    AccessPolicy {
        uuid id PK
        string name "Policy Name"
        string target_scope "GLOBAL_AUTH | NETWORK_EDGE | OAUTH2_TOKEN | SESSION_MGT"
        string status "ACTIVE | DISABLED"
        jsonb rules "enforcement predicates"
        timestamptz created_at
        timestamptz last_modified_at
        uuid created_by FK "Identity"
    }

    AccessPolicyScope {
        uuid policy_id PK,FK
        uuid scope_id PK,FK
    }

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

    AccessPolicy ||--o{ AccessPolicyScope : "applies to"
    AccessPolicyScope }o--|| Scope : "scope"
    AuditLog }o--|| Identity : "performed by"
    SystemSetting }o--|| Identity : "last updated by"
```

---

## Field provenance (where each field came from)

| Entity | Fields backed by a screen / SRS |
|---|---|
| `Identity` | SRS §2.1 (email/password, enable/disable); `admin_identity_management` table columns (User Entity, Status, Registration Date, Access Control) |
| `Session` | `user_profile_sessions_2` table (Device/Application, Location (IP), Last Active, Action) |
| `Role` | `admin_access_policies_1` (Role Name, Description, Assigned Identities); `admin_role_management` adds Type (Built-in/Custom) + Last Modified |
| `ClientApplication` + `RedirectUri` | `admin_create_edit_client` (Application Name, Redirect URIs, Client ID, Client Secret); `admin_client_management` table |
| `Scope` | `admin_access_policies_2` (OAuth 2.0 Scopes: openid, profile, email) |
| `AccessPolicy` | `admin_access_policies_2` (Policy Name, Target Scope, Status + values GLOBAL_AUTH / NETWORK_EDGE / OAUTH2_TOKEN / SESSION_MGT) |
| `AuditLog` | `admin_audit_logs` table (Timestamp UTC, Actor, Action/Event, Status, IP Address) |
| `SystemSetting` | `admin_system_settings` (Access Token Expiration, Refresh Token Expiration, Password Complexity, Min Password Length, Primary Color, Company Logo) |
| `AuthorizationCode` / `AccessToken` / `RefreshToken` | SRS §2.2 (authorize + token endpoints, JWT) — fields are OAuth 2.0 spec standards |

## Open modelling questions (flag before Step 2)

1. **Permission seeding.** Should `Permission` be a static enum in code (simpler) or a table you can grow from the UI (more flexible but needs a management screen that doesn't exist in the design)? Default: static enum, but tracked in DB so `RolePermission` FKs are valid.
2. **PKCE.** Do we require PKCE for public clients (mobile/SPA), or only support confidential clients? The design doesn't say. Default: support both, make PKCE optional at the code-challenge columns.
3. **Multi-tenant?** Nothing in the SRS or design suggests tenants/orgs. Model assumes single-tenant.
4. **Policy rules schema.** `AccessPolicy.rules` is `jsonb` today. If the UI ever gets a rules editor, we'll need a stricter schema (allow/deny list, conditions). Leaving flexible for PoC.
