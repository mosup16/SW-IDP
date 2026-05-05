# Team handbook

This is the doc you read **before** you pick up an issue. It covers the conventions, vocabulary, and PR mechanics this project uses. If something in an issue is unclear, the answer is probably here.

Other docs to know about:

- [`STACK.md`](STACK.md) — what tools / libraries / topology
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — service boundaries + data flow
- [`ERD.md`](ERD.md) — database schema
- [`REQUIREMENTS.md`](REQUIREMENTS.md) — design tokens + screen inventory
- [`stitch-export/app.html`](stitch-export/app.html) — the visual prototype (open in a browser)
- [`FE-BRANCH-AUDIT.md`](FE-BRANCH-AUDIT.md) — **why is the FE code structured the way it is?** Read when surprised.

---

## Branch & PR conventions

**Branch naming:**
- FE pair work: `pair-<n>/<epic>/<short-slug>` (e.g. `pair-1/auth-ui/login-screen`)
- BE work: `be/<epic>/<short-slug>` (e.g. `be/identity-service/register-and-login`)
- Cross-cutting: `chore/<short-slug>` or `fix/<short-slug>`

**Commit messages:**
- Imperative present tense (`Add`, `Fix`, `Update` — not `Added` / `Adding`).
- One commit per logical change is preferred over many tiny commits.
- For pairs: add a `Co-authored-by:` trailer for the navigator on commits authored by the driver.

**PR titles** match the issue's prefix exactly:
- `[<epic>] <short title>` for screen / wiring / BE work (e.g. `[auth-ui] Login screen`).
- `[fix] <short>` or `[chore] <short>` for cleanup.

**PR description template** lives in `.github/pull_request_template.md`. The issue itself includes a copy-paste-able PR description in its "PR description template" section — use that as the starting point.

---

## Pair-programming workflow

The 4 FE devs work as **2 pairs**: Pair 1 and Pair 2.

- **Driver / navigator swap every ~45 min.** Both run the same machine in turn.
- **Both names go on the PR description** (`driver: @x  navigator: @y`).
- **Cross-pair review:** Pair 1 reviews Pair 2's PRs, and vice versa. No pair reviews itself.
- **Solo work** is OK only for trivial cleanup. Anything substantive is paired.
- **Mid-project pair-swap** (~end of Phase 1) — swap one member between pairs for cross-pollination. We'll announce when.

If you get stuck for more than 4 hours: ping the user. Don't grind silently.

---

## What's a "stub"?

Many issues say things like "the auth context is mocked here" or "wire to a stub action". The convention in this project:

A **stub** is a function that *looks* like the real thing (same shape, returns a Promise, etc.) but returns hardcoded fake data instead of calling the real backend. Use this pattern:

```js
// services/authService.js
const MOCK = true; // flip when the real BE endpoint exists

export const authService = {
  signIn: async (creds) => {
    if (MOCK) return { id: 'u1', email: creds.email, displayName: 'Alex' };
    return apiClient.post('/identity/login', creds);
  },
};
```

**Don't:** throw `Error('not implemented')`, `console.log` and return `undefined`, or invent your own pattern. Use the `MOCK = true` flag + return shape that matches what the real BE will eventually return.

---

## Where things live in `apps/web/`

The team has settled on this structure (see `FE-BRANCH-AUDIT.md` §2 if you're surprised):

```
apps/web/src/
├── App.jsx                           — top-level routes
├── main.jsx                          — providers (QueryClient, Auth)
├── index.css                         — design tokens (CSS variables in :root)
├── components/
│   ├── icon.js                       — Lucide icon re-exports
│   ├── layout/
│   │   ├── AdminLayout.jsx           — Sidebar + Navbar + <Outlet />
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx                — (the "Topbar" — we call it Navbar)
│   └── ui/
│       └── <Primitive>.jsx + .css    — co-located, BEM class names
├── hooks/
│   └── use<X>.jsx                    — useAuth, useToast, etc.
├── pages/
│   ├── auth/<Page>/<Page>.jsx + .css
│   ├── admin/<Page>/<Page>.jsx + .css
│   ├── admin/modals/<Modal>/<Modal>.jsx + .css
│   └── profile/<Page>/<Page>.jsx + .css
├── router/
│   └── ProtectedRoute.jsx
└── services/
    ├── apiClient.js                  — Gateway-aware fetch helper
    ├── authService.js
    ├── adminService.js               — admin endpoints (settings, audit logs)
    └── oauthService.js               — clients, token endpoints
```

**Important conventions:**
- **Plain CSS, BEM class names.** No Tailwind utility classes (`bg-surface`, `text-on-surface`) — read tokens from `index.css`'s `:root` (`var(--page-bg)`, `var(--btn-primary)`, etc.). Class names use BEM: `.login-page__card`, `.btn--primary`, `.sidebar__item--active`.
- **`pages/` not `routes/`.** Each page has its own folder containing `<Page>.jsx` + `<Page>.css`.
- **`services/` for FE API clients** (yes, this collides with the BE folder name — see audit doc).
- **Co-locate the CSS** with its `.jsx`. If you find a `.css` file under `assets/styles/`, move it next to its component (this is fix-on-encounter, see audit doc).
- **react-router-dom v7.** Layout routes use `<Outlet />`. Protected routes wrap children.
- **camelCase route paths** (`/userProfile`, `/auditLogs`, `/systemSettings`) — that's what the team picked, keep it consistent.

---

## How to read `app.html`

`design/stitch-export/app.html` is a single-file prototype with **all 9 screens + 5 modals**. Each one has a stable HTML id (e.g. `id="screen-login"`, `id="modal-edit-role"`) that issues reference.

To find a specific screen:

1. Open `app.html` in a browser. A floating switcher in the bottom-right lets you click between screens.
2. To find it in the source, open the file in your editor and `Ctrl+F` for the id (e.g. `screen-login`).

The `<style>` block at the top of `app.html` defines the unified component classes (`.btn-primary`, `.input-search`, `.badge-success`, etc.). Use them as the **visual reference** — but in your own code, write equivalent BEM CSS that reads from `index.css` variables.

---

## How to take the side-by-side screenshot for the PR

Every screen issue's DoD asks for a side-by-side screenshot. Here's the recipe:

1. Open `apps/web/src/index.html` (your dev server) and your built screen.
2. Open `app.html` in a separate browser window. Use the floating switcher to navigate to the same screen.
3. Take a screenshot of each at the same width (any 16:10-ish viewport).
4. Put them side-by-side in the PR description as a small markdown table:

```markdown
| Spec (app.html screen-login) | Implementation |
|---|---|
| ![](spec.png)                | ![](impl.png)  |
```

GitHub renders the images inline. Reviewers compare visually.

---

## Glossary

| Term | What it means |
|---|---|
| **Primitive** | A reusable UI component in `components/ui/`. Built once in #2; consumed by every screen. |
| **Screen / Page** | A top-level route. Lives in `pages/`. |
| **Modal** | An overlay with a backdrop. Lives in `pages/admin/modals/<Name>/`. |
| **Stub** | Fake function that returns hardcoded data; used while the real BE isn't wired. |
| **Mock data** | A small seeded array of fake entities in `services/<entity>Service.js` (or `lib/mock-data/`). |
| **Token** | A design token — a named color / font / radius / shadow value declared as a CSS variable in `index.css`. (Not OAuth token!) |
| **Latent fix** | An issue from `FE-BRANCH-AUDIT.md` §1 that becomes a real bug only when its code path is reached. The pair fixes it inline in the same PR. |
| **AdminLayout** | The `<Sidebar /> + <Navbar /> + <Outlet />` shell that wraps every admin page. |
| **ProtectedRoute** | A wrapper that redirects to `/` when the user isn't signed in. |
| **Pair**, **Driver**, **Navigator** | Two devs at one machine; the driver types, the navigator reviews. They swap roles every ~45 min. |
| **Cross-pair review** | Pair 1 reviews Pair 2's PRs, and vice versa. |
| **Fix-on-encounter** | The rule for latent fixes: whoever first hits one fixes it inline rather than filing a separate ticket. |

---

## Issue anatomy

Every rewritten issue has these sections (in this order):

1. **TL;DR** — 1-2 sentences. What this PR does.
2. **Before you start** — issues to wait for + files to skim first.
3. **What to render** *(visual issues only)* OR **What you should see when it works** *(no-visual issues)* — your reference, or your manual smoke test.
4. **Walkthrough** — numbered, paste-able steps with file paths and code skeletons.
5. **Don't add this** — explicit negative space (features you might assume but shouldn't add).
6. **Latent fixes you'll likely hit** *(if any)* — TDR items this PR will absorb.
7. **Verify before opening the PR** — checklist.
8. **PR description template** — copy-paste starting point.

Issues are tasks, not specs. Read them top-to-bottom, follow the steps, ship.

---

## Escalation

Ping the user (in the PR or in chat) if any of these:

- A schema-level change to `ERD.md` is needed.
- A new external dependency (npm package, Java library) is required that's not in `STACK.md`.
- A security decision (crypto choice, secret handling, token TTL).
- You've been stuck for >4 hours.
- An issue's spec contradicts what the design clearly shows.

Anything else — work it out with your pair / the other pair / your reviewer. Don't wait on the user for non-blockers.
