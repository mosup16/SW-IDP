# Design — Stitch export (consolidated)

Source-of-truth visual references for SW-IDP, exported from Claude Design (claude.ai/design).

## Files

| File | What it is |
|---|---|
| `app.html` | **Primary reference.** Single-file prototype containing all 9 screens + 5 modals with a unified component layer (buttons / inputs / badges / modals / dropdowns / toasts / sidebar / topbar). Self-contained — open in a browser, use the floating switcher (bottom-right) to jump between screens. |
| `DESIGN.md` | The "Tonal Architecture & Secure Monolith" design-system manifesto. Tokens, type scale, component rules. |
| `screenshots/01-identities.png` | Reference screenshot of the Identities page (used to verify visual fidelity). |
| `srs_poc_identity_provider_idp.txt` | Original product brief. Useful for "why does this exist" context. |

## How to find a specific screen / modal in `app.html`

Each screen and modal has a stable HTML id. Search for these in `app.html` to jump to its source:

| Screen / modal | id in `app.html` |
|---|---|
| Login | `screen-login` |
| Register | `screen-register` |
| Identities (admin list) | `screen-identities` |
| Audit Logs | `screen-audit` |
| Roles (list) | `screen-roles` |
| Clients (list) | `screen-clients` |
| Client Configuration (create/edit client) | `screen-client-config` |
| System Settings | `screen-settings` |
| User Profile | `screen-profile` |
| Create-Identity modal | `modal-create-identity` |
| Edit Role modal | `modal-edit-role` |
| Delete Role confirmation | `modal-delete-role` |
| Delete Client confirmation | `modal-delete-client` |
| Secret-rotated success modal | `modal-secret-rotated` |

## How issues reference this folder

Foundation and screen issues cite `design/stitch-export/app.html` plus an `id="..."` so a beginner can jump straight to the relevant block. Example: `app.html#screen-identities` for the identities page.

## What's gone (vs. earlier exports)

- The 17 per-screen folders (`user_login/`, `admin_role_management/`, etc.) are **dropped**. Everything is consolidated into `app.html`.
- The `admin_access_policies_*` screens are dropped — Access Policies was retired from the project; role management absorbed it.
- The `admin_create_edit_role` screen is now a **modal** (`modal-edit-role`) — no longer a separate page route.
- The `user_profile_sessions_1` and `_2` variants are merged into one `screen-profile`. The "Assigned Roles" checkbox grid is removed; profile shows a single-line Role.
