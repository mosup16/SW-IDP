# Frontend-branch audit (2026-04-28)

A walkthrough of `origin/Frontend-branch` at commit `82e7c44` (30 commits ahead of `main` at that time).

**Build status:** the SPA currently builds and runs (`npm run build` → 51 modules transformed, 0 errors; verified 2026-04-28). Page components are empty fragments, so the broken-looking imports inside the primitives (corrupted CSS filenames, missing files, typos) are dead code that Vite tree-shakes out. They will only matter once a page tries to import a primitive.

This doc serves two purposes:

1. **TDR (tech-debt record).** Section 1 lists known issues that don't break anything today but will bite someone when they reach them. They are intentionally not tracked as separate GitHub issues — the screen-implementing pair fixes them on first encounter.
2. **Convention diff vs. the locked spec.** Section 2 documents the conventions the team picked instead of what the spec said. These are kept as-is; the spec is updated to match reality once the branch lands.

The goal is to write down the world as it actually is so the project keeps moving.

---

## Section 1 — Latent issues (TDR)

These do **not** break the build today (verified — see header). They are recorded here as known issues. Each one becomes a real bug the moment the relevant code path is reached:

- The CSS-related items (S1, S2, S3) become real when a page actually imports a primitive (Login importing Button, etc.).
- S4 is a typo with no current effect (the component still imports + renders fine — `SystemSettingd` is just the local name binding).
- S5 stops being inert when the team wires the first admin page that's supposed to show inside AdminLayout.
- S6 / S7 stop being inert when auth gating is wired.

**Fix-on-encounter rule:** whoever picks up the work that touches one of these — fix it inline in the same PR. No separate tracker.

### S1. CSS files with corrupted Unicode filenames

Inside `apps/web/src/assets/styles/`:

```
Adminlayout · CSS         ← literal Unicode middle-dot (·), trailing " CSS" (no extension)
Ambientshadowcard · CSS
Brandmark ·css
Navbar · CSS
Sidebar · CSS
```

Vite cannot resolve these as `.css` imports. They almost certainly came from copy-pasting a markdown heading like *"Component · CSS"* into the file-create dialog.

**Fix:** rename to `<ComponentName>.css` (plain ASCII, lowercase extension), one file per component, kebab-case or camelCase whatever the team picks — but consistent.

### S2. `Botton.css` typo

`apps/web/src/assets/styles/Botton.css` exists; the matching component is `Button.jsx` and imports `'./Button.css'`. Two problems in one file: the typo plus the path mismatch (S3 below).

**Fix:** rename to `Button.css`, place co-located with the component.

### S3. CSS imports use the wrong path

Every primitive does `import './<Component>.css'` from `apps/web/src/components/ui/` — but the actual CSS files live in `apps/web/src/assets/styles/`. Every one of these imports will fail at build time. Examples:

- `components/ui/Button.jsx` → `import './Button.css'` → looks for `components/ui/Button.css`, doesn't exist
- `components/layout/Sidebar.jsx` → `import './Sidebar.css'` → looks for `components/layout/Sidebar.css`, doesn't exist

**Fix:** pick one convention and stick to it (the team should choose):

- **Option A:** move every `<Component>.css` next to its `<Component>.jsx`. Drop `assets/styles/`. Cleanest.
- **Option B:** keep `assets/styles/` and update every JSX file's import path to `'../../assets/styles/<Component>.css'`. More boilerplate, but groups CSS in one place if that's what the team prefers.

### S4. `App.jsx` import typo: `SystemSettingd`

```jsx
import SystemSettingd from './pages/admin/SystemSettings/SystemSettings';
```

`SystemSettingd` (extra `d`) is also used in the JSX route. The component itself exports as `SystemSettings`. The route element will be `undefined` and React will crash when navigating to `/systemSettings`.

**Fix:** rename to `SystemSettings` everywhere in `App.jsx`.

### S5. `AdminLayout` exists but is not wrapping admin routes

`AdminLayout.jsx` was built (good) but `App.jsx` renders all admin pages as bare routes. None of them will show the sidebar, the topbar, or the active-state pill until AdminLayout wraps them.

**Fix:** wrap the admin route group with a layout route. Example:

```jsx
<Route element={<AdminLayout />}>
  <Route path="profile" element={<UserProfile />} />
  <Route path="clients" element={<ClientManagement />} />
  ...
</Route>
```

`AdminLayout` then renders `<Sidebar />` + `<Navbar />` + `<Outlet />` for the page content.

### S6. `ProtectedRoute.jsx` is empty (0 bytes)

A protected-route wrapper file exists in `apps/web/src/router/` but has no content. Authenticated pages are reachable without signing in.

**Fix:** belongs to whoever picks up the auth context wiring (formerly issue #3). Keep this on the radar.

### S7. Empty wiring files (0 bytes)

```
apps/web/src/hooks/useAuth.jsx
apps/web/src/hooks/useToast.jsx
apps/web/src/services/apiClient.js
apps/web/src/services/authService.js
apps/web/src/services/adminService.js
apps/web/src/services/oauthService.js
```

Scaffolded ahead of being needed. Not a stopper *today* (nothing imports them yet), but **will become one** the moment the first FE issue tries to actually call the BE. Track with the auth-wiring follow-up.

---

## Section 2 — Accepted deviations from the locked spec

The team made these choices. Per the user, they stay. The spec is updated to reflect reality — see Section 3 for the diff.

### D1. Plain CSS instead of Tailwind utility classes

**Spec said:** Tailwind v4 + `@theme` block in `index.css`; style with utility classes only; no per-component CSS files.

**Team chose:**

- Plain CSS variables in `:root` of `index.css` (instead of Tailwind's `@theme`).
- One CSS file per component in `apps/web/src/assets/styles/`.
- BEM-style class names in JSX (e.g. `btn`, `btn--primary`, `sidebar__item--active`).
- `clsx` for conditional class joining.

**Implications going forward:**

- Tailwind utility classes (`bg-surface`, `text-on-surface-variant`, `rounded-xl`, `font-headline`) are **not** the styling vocabulary — components use BEM class names.
- The token reference is `apps/web/src/index.css`'s `:root` block. Issues / docs that reference Tailwind tokens (e.g. `bg-surface-container-lowest`) should be re-read as "use the equivalent CSS variable from `index.css`".
- `app.html` references in screen issues are still useful as a *visual* contract — the team translates Tailwind classes to BEM by hand.
- New components: add `<Component>.css` co-located (or in `assets/styles/` per S3's fix). Define block + element + modifier classes. Read tokens from `index.css`.

### D2. `react-router-dom` v7 instead of v6

**Spec said:** React Router v6 (locked in `STACK.md`).

**Team chose:** v7 (`^7.14.2`) at both the repo root and `apps/web/package.json` (the root one is dead weight — see S-pending below).

**Implications:** v7's API is mostly compatible with v6 but `<Outlet />`, `useNavigate`, data routers, and the new framework mode have different ergonomics. Future routing code follows v7 idioms. The spec gets updated to v7.

### D3. Folder structure `pages/` instead of `routes/`

**Spec said:** route components under `apps/web/src/routes/<route>/`.

**Team chose:** under `apps/web/src/pages/<area>/<PageName>/<PageName>.jsx`. Areas: `admin/`, `auth/`, `profile/`. Modals nested as `pages/admin/modals/<ModalName>/<ModalName>.jsx`.

**Implications:** new screens follow this pattern. References in issues to `apps/web/src/routes/...` should be read as `apps/web/src/pages/...` going forward.

### D4. `Navbar.jsx` instead of `Topbar.jsx`

**Spec said:** the topbar component is `components/layout/Topbar.jsx`.

**Team chose:** `components/layout/Navbar.jsx` (~4.6 KB CSS).

**Implications:** purely a name change. Future references to "Topbar" mean `Navbar`.

### D5. `services/` folder for FE API clients

**Spec said:** `apps/web/src/lib/api/<entity>.js` for server-state hooks; `apps/web/src/lib/http.js` for the Gateway-aware HTTP client.

**Team chose:** `apps/web/src/services/<entity>Service.js`:

```
apps/web/src/services/apiClient.js        ← (the HTTP client)
apps/web/src/services/authService.js
apps/web/src/services/adminService.js
apps/web/src/services/oauthService.js
```

**Implications:** the name "services" collides with the backend `services/` directory at the repo root. Mostly harmless because they're in different absolute paths, but worth flagging in onboarding ("FE services = HTTP client + per-entity functions; BE services = each Spring Boot app").

### D6. `icon.js` (singular)

**Spec said:** `apps/web/src/components/icons.js`.

**Team chose:** `apps/web/src/components/icon.js`.

Cosmetic. Keep.

### D7. Camel-case route paths

**Spec said:** kebab-case routes matching the design (`/profile`, `/audit-logs`, `/system-settings`).

**Team chose:** camelCase (`/userProfile`, `/auditLogs`, `/systemSettings`, `/clientConfiguration`, `/roleForm`).

**Implications:** if you ever care about SEO, copy-paste-ability, or matching backend route conventions, this is a quirk. For an internal admin SPA it doesn't really matter. Document in the onboarding so people don't try to "fix" it later.

### D8. Page skeletons in place, content empty

Every page file is currently:

```jsx
function AuditLogs(){ return (<></>) }
export default AuditLogs;
```

Expected — work-in-progress. Continue per the screen issues.

### D9. Co-located README / handbook absent

There's no team handbook in the repo. Discussed in the previous review — separate work item.

### D10. Custom `--btn-primary`, `--badge-active-bg`, etc. CSS variable namespace

The team's `:root` defines a project-specific naming layer (`--btn-primary`, `--page-bg`, `--sidebar-bg`, `--badge-default-bg`) rather than the M3 token names (`--color-primary`, `--color-surface-container-low`). The values are correct, but the **names** drift from the design-system's published vocabulary.

**Implications:** new components reference `--btn-primary`, not `--color-primary`. The mental model is "component-purpose-based variable names", not "design-token-based". Document in the team handbook so designers and devs use the same words. Keep a small mapping table somewhere (M3 token → project variable) for translating from the design.

---

## Section 3 — `STACK.md` adjustments needed (proposed, not yet applied)

When the FE branch lands on `main`, the locked spec should be updated to match reality:

- **Frontend table:** swap *"Tailwind v4 with the Material-3 tokens"* → *"plain CSS, BEM-style class names, design tokens declared as `:root` custom properties in `apps/web/src/index.css`"*.
- **Frontend table:** swap *"React Router v6"* → *"React Router v7"*.
- **Repo-layout block (the comment on the `apps/web/` line):** drop "TypeScript" (it's already JS, that's old wording).

Don't do these until the FE branch is merged. Once it's merged, file a small PR.

---

## Section 4 — Future cleanup (not tracked as separate issues)

Per the fix-on-encounter rule above, none of the Section 1 items get their own GitHub issue. They live in this doc as a reference checklist. The screen and wiring issues already in the tracker absorb them naturally:

| Item | Naturally absorbed by |
|---|---|
| S1 (corrupted CSS filenames) | the first screen issue that imports a primitive (e.g. Login screen #9) |
| S2 (Botton.css typo) | same — Login imports Button |
| S3 (broken `./X.css` import paths) | same — every primitive consumed by a screen |
| S4 (`SystemSettingd` typo) | the System Settings screen issue (#26 / #27) |
| S5 (AdminLayout not wrapping admin routes) | first admin screen that needs the sidebar to render — pair fixes the App.jsx routing in the same PR |
| S6 (empty `ProtectedRoute.jsx`) | the auth-wiring issue (formerly #3) |
| S7 (empty hooks/services files) | same as S6 |
| S-pending (root `/package.json` + `/package-lock.json`) | next time someone touches dependency files; or do it as a tiny standalone PR if it bothers anyone |

If any one of these starts blocking *multiple* issues at once, escalate to a real GH issue at that point.

### S-pending. Redundant root `/package.json` + `/package-lock.json`

The team installed `react-router-dom` at the repo root by mistake. The dep is now also in `apps/web/package.json` (where Vite reads it from), so the root files are dead weight:

```
/package.json       — has `react-router-dom: ^7.14.2`, nothing else
/package-lock.json  — corresponding lockfile
```

Delete next time someone touches dependencies; not urgent.

---

## Closing note

Every deviation in Section 2 is *understandable*. The spec called for Tailwind without explaining why; the team built fine working CSS. The spec called for kebab-case paths without explaining why; the team built working camelCase ones. The point of this document isn't to relitigate — it's to write down the world as it actually is so the rest of the project can keep moving.

**The build is green today.** The latent issues in Section 1 will surface as real bugs when their code paths are reached, and the pair touching that area fixes them inline. No urgency, no separate trackers.
