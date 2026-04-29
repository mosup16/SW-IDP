# SW-IDP — Requirements extracted from the Stitch export

This document summarises what the uploaded Stitch export (`stitch-export/stitch_system_user_interface/`) actually contains, and what SW-IDP is asking to be built. It is intended to be reviewed before we pick a stack and start coding.

## 1. Product scope (from the SRS)

The project is a **Proof-of-Concept Identity Provider (IdP)** — a simplified "Login with X" system. Source: `stitch-export/stitch_system_user_interface/srs_poc_identity_provider_idp.txt`.

Three capabilities:

1. **Identity Management (end-user)**
   - Register with email + password
   - Log in
   - View profile / log out / manage sessions
2. **OAuth 2.0 Authorization Server**
   - `GET /authorize` (authorization code flow)
   - `POST /token` (exchange code → access token)
   - Tokens as JWTs
3. **Admin Dashboard**
   - Client applications: create, list, rotate `client_secret`, delete
   - Identities: create, list, enable/disable

The SRS PNG (`screenshot_20260418_052650_samsung_notes.jpg/screen.png`) additionally contains a **system-architecture diagram** and an **OAuth code-flow sequence diagram** that aren't in the `.txt` file — useful as a reference for backend routes later.

## 2. Export format — what Stitch gave us

- 17 standalone HTML files, one per screen, under folders named after the screen.
- Each file is self-contained and uses **Tailwind via CDN** (`cdn.tailwindcss.com?plugins=forms,container-queries`) with an inline `tailwind.config` block.
- 18 PNG screenshots, one per screen (`screen.png` in each folder), for visual reference.
- 1 design-system manifesto: `aegis_core/DESIGN.md` ("Tonal Architecture & The Secure Monolith").
- 1 SRS document: `srs_poc_identity_provider_idp.txt`.
- 1 PDF-reader screenshot of the SRS with architecture diagrams.

There is **no** framework code, no `package.json`, no JSX — pure HTML + Tailwind classes.

## 3. Screen inventory

| # | Folder | Title (from `<title>`) | Purpose | Lines |
|---|---|---|---|---|
| 1 | `user_login` | Login \| Sovereign IdP | End-user login form | 181 |
| 2 | `user_registration` | Register \| Sovereign IdP | End-user registration form | 191 |
| 3 | `user_profile_sessions_1` | Sovereign IdP - User Profile | Profile view (variant 1) | 320 |
| 4 | `user_profile_sessions_2` | Sovereign IdP - User Profile | Profile view (variant 2) | ? |
| 5 | `admin_client_management` | Sovereign IdP - Client Overview | OAuth client list | 395 |
| 6 | `admin_create_edit_client` | Sovereign IdP - Client Configuration | OAuth client form | 305 |
| 7 | `admin_identity_management` | Sovereign IdP - Identities | User list | 388 |
| 8 | `admin_role_management` | Aegis Core - Role Management | Role list | 371 |
| 9 | `admin_create_edit_role` | Edit Role - Aegis Core | Role form | ? |
| 10 | `admin_access_policies_1` | Sovereign IdP - Role Management | Shows "Role Management" content — **looks like a duplicate** of #8 (see open question Q1) | 302 |
| 11 | `admin_access_policies_2` | Sovereign IdP - Access Policies | Policies + OAuth scopes | ? |
| 12 | `admin_audit_logs` | Sovereign IdP - Audit Logs | Log viewer | 316 |
| 13 | `admin_system_settings` | Admin Settings - Sovereign IdP | System settings | 268 |
| 14 | `modal_create_identity` | Sovereign IDP - Create New Identity | Modal — create user | 240 |
| 15 | `modal_delete_role_confirmation` | Delete Role Confirmation - Aegis Core | Modal — confirm delete | 182 |
| 16 | `modal_secret_rotation_success` | Sovereign IDP - Client Secret Rotated | Modal — success/secret-reveal | ? |
| 17 | `popup_delete_confirmation` | Sovereign IDP - Delete Client Application | Popup — confirm delete client | 133 |

> The SRS only explicitly lists client management, identity management, login/register, and profile. Roles, access policies, audit logs, and system settings appear in the design but **not** in the SRS (see Q3).

## 4. Reusable component inventory

Shared across many screens — worth extracting as first-class components in Step 2:

- **AdminLayout** (sidebar + main): fixed 256px-wide `<aside>` with logo mark, "Security Console / Enterprise Tier" branding, nav items (Clients, Identities, Access Policies, Audit Logs, Settings, Sign Out). Uses `bg-surface-container-low` with no border.
- **Sidebar nav item**: icon (Material Symbols) + label, active state indicated by a `surface-tint` vertical pill on the left, hover via background tone shift.
- **PageHeader**: large Manrope headline + supporting paragraph in `on-surface-variant`, right-aligned action buttons.
- **DataTable**: no horizontal row dividers; rows separated by whitespace; `surface-container-low` hover; uppercase, wide-letter-spaced `label-sm` column headers.
- **StatusBadge**: fully-rounded, soft tonal fill (e.g. success = `on-tertiary-container` text on `tertiary-fixed @ 30%`).
- **GhostInput**: `bg-surface-container-high` with `border-b-2 border-outline-variant`, focus border becomes `surface-tint`. Error state uses `error` color with 10% `error-container` fill.
- **PrimaryButton** ("monolith gradient"): linear gradient `#000 → #001b3d`, rounded `lg`, `active:scale-[0.98]`.
- **SecondaryButton**: `secondary-container` background, no border.
- **GlassCard / GlassPanel**: `rgba(255,255,255,0.85)` + 24px backdrop-blur, used for login/modals.
- **AmbientShadowCard**: `surface-container-lowest` + `box-shadow: 0 12px 32px rgba(25,28,30,0.12)`.
- **Modal**: centred glass card + full-screen dim backdrop.
- **Popup** (smaller): same pattern at a tighter width — use the same component.
- **BrandMark**: `shield_person` Material Symbol in a gradient tile + "Sovereign IdP" wordmark.

## 5. Design tokens (from inline `tailwind.config` + `aegis_core/DESIGN.md`)

Token naming follows **Material Design 3**. The palette is already authored once per file (identical across screens) and should be lifted into a shared `tailwind.config.ts` in Step 2.

**Colors** (26 tokens — partial list):
- Base: `primary #000000`, `on-primary #ffffff`, `primary-container #001b3d`, `primary-fixed #d6e3ff`
- Secondary: `secondary #515f74`, `secondary-container #d5e3fc`
- Tertiary (trust-blue): `tertiary #000000`, `tertiary-container #001e2f`, `tertiary-fixed #c9e6ff`
- Surfaces: `surface #f7f9fb`, `surface-container-low #f2f4f6`, `surface-container #eceef0`, `surface-container-high #e6e8ea`, `surface-container-highest #e0e3e5`, `surface-container-lowest #ffffff`
- Text: `on-surface #191c1e`, `on-surface-variant #45464d`
- Lines/outlines: `outline #76777d`, `outline-variant #c6c6cd`
- Accent: `surface-tint #005db5` (active-state blue), `error #ba1a1a`, `error-container #ffdad6`

**Typography**:
- `headline` = Manrope (400/600/700/800) — titles, brand wordmarks
- `body` / `label` = Inter (400/500/600) — form labels, body, table data
- Editorial rule: `label-sm` + `uppercase` + `0.05–0.1em` letter-spacing for table headers and form labels

**Radii**:
- `DEFAULT 0.125rem` · `lg 0.25rem` · `xl 0.5rem` · `full 0.75rem`

**Elevation** (no hard shadows):
- Ambient shadow: `0 12px 32px rgba(25,28,30,0.12)` — only for floating elements
- Tonal layering — preferred. Contrast between `surface` and `surface-container-*` replaces borders.
- Glassmorphism: `rgba(255,255,255,0.85)` + `backdrop-blur(24px)` for auth cards / modals

**Spacing**: Tailwind default scale. DESIGN.md emphasises `16px` row padding and generous whitespace.

## 6. Asset inventory

- **Fonts** (Google Fonts CDN): Manrope, Inter, Material Symbols Outlined.
- **Icons**: Material Symbols Outlined (icon font). Used throughout — e.g. `shield_person`, `security`, `group`, `policy`, `history_edu`, `settings`, `logout`, `arrow_forward`, `check_circle`, `menu_book`. No raster icons.
- **Images**: one noise/grain texture served from `lh3.googleusercontent.com/aida-public/...` (Stitch's asset CDN) — used as a 3%-opacity soft-light overlay on the login screen. **Will need to be re-hosted or swapped** (external CDN is not reliable).
- **No local SVG, no logo files** — brand is rendered entirely from icon-font + typography.

## 7. Stack

**Locked. See `design/STACK.md` for the canonical decisions.** Key points relevant to porting the screens:

- React + Vite + plain JavaScript (no TypeScript) + Tailwind v4 (tokens configured globally per the design tokens in §5).
- `lucide-react` for icons (see Q4 below + §10 mapping).
- `react-hook-form` + `zod` for form validation.
- shadcn-style locally-owned primitives for the interactive behaviours that the static Stitch export does not implement (modal, alert dialog, select, dropdown menu, tabs).
- The SPA is the only frontend artefact and talks **only** to the Spring Cloud Gateway — there is no Next.js BFF.

Anything not on this list (server framework, service discovery, persistence, OAuth implementation) lives in `STACK.md` and `ARCHITECTURE.md`, not here.

## 8. Decisions so far

- **Q1 — Role Management layout: `admin_access_policies_1` (minimal)** is canonical. Implication: the canonical admin sidebar is the *shorter* one (User Profile, Role Management, Audit Logs, System Settings), which differs from the longer sidebar in `admin_client_management` (Clients, Identities, Access Policies, Audit Logs, Settings, Sign Out). I'll merge the two into one nav that contains every page in the build (see §10 below).
- **Q2 — User profile: `user_profile_sessions_2`** (the variant with the Assigned Roles checkbox section).
- **Q3 — PoC scope: port every screen in the design except access policies.** Roles, Audit Logs, and System Settings are in scope. The two `admin_access_policies_*` screens and the `AccessPolicy` entity are dropped — policy-shaped requirements are absorbed by role management. See `STACK.md` ("Out of scope").
- **Q4 — Icons: `lucide-react`**. Material Symbols will be mapped to the nearest Lucide equivalent during porting; the mapping lives in `src/components/icons.ts` so swaps stay centralised.
- **Q5 — Brand name: configurable via env**. All screens reference a single `<Brand />` component that reads `NEXT_PUBLIC_BRAND_NAME` (default still TBD — likely "Sovereign IdP" as the most-used string).
- **Q6 — Noise overlay: drop it**. Login renders without the 3%-opacity grain; the abstract blurred shapes still provide texture.
- **Q7 — Commit the raw Stitch export**. `design/stitch-export/` is tracked in git for visual diffing during porting.
- **Scopes cut from the PoC.** OAuth 2.0 scopes (`openid`, `profile`, `email`, per-client allowlist) are not supported. Tokens and authorization codes do not carry a `scopes` field. The `admin_access_policies_2` screen (which previously rendered the non-functional scopes panel) is no longer ported. See `design/ERD.md` and `design/STACK.md`.

## 10. Notes that emerge from the decisions (for Step 2 to handle)

- **Unified sidebar.** With the in-scope screens (Q3) and the minimal-layout sidebar chosen as canonical (Q1), the final sidebar lists: User Profile, Clients, Identities, Roles, Audit Logs, System Settings, Sign Out. (Access Policies is removed — see Q3.) The visual style of `admin_access_policies_1`'s sidebar (no top-nav bar, simple icon+label rows, active-state pill) is kept; only the item list is extended.
- **Brand naming.** The export currently mixes "Sovereign IdP", "Sovereign IDP", and "Aegis Core". After Q5, all of these become `{brand}` and the value comes from env at render time.
- **Mock data.** Pages without a corresponding SRS-defined backend (Roles, Policies, Audit Logs, Settings) will still need data to render — Step 2 will define a `src/lib/mock-data/*` shape so the UI is buildable before the API exists.
- **Lucide mapping (preview).** `shield_person → ShieldUser`, `security → ShieldCheck`, `group → Users`, `policy → ScrollText`, `history_edu → ClipboardList`, `settings → Settings`, `logout → LogOut`, `arrow_forward → ArrowRight`, `check_circle → CheckCircle2`, `menu_book → BookOpen`. Final list confirmed in Step 2.

## 9. Build sequence

Stack is now locked (see `STACK.md`). The build order, encoded as GitHub issues under `epic:foundation`, is:

1. Bootstrap `apps/web/` (Vite + React + Tailwind v4) with the design tokens from §5 wired into the global stylesheet.
2. Build the shared primitive set (Button, Input, Card, Modal, Dialog, AlertDialog, Tabs, Select, DropdownMenu, DataTable, StatusBadge, GhostInput, GlassCard, BrandMark, AdminLayout) — this is the FE reference.
3. Wire React Router + protected routes + auth context + TanStack Query.
4. Port each in-scope screen from §3 into a route under `apps/web/src/`.

Service-side build sequence is owned by `epic:foundation` + the three BE epics in `ARCHITECTURE.md` §1.
