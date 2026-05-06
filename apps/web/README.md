# `apps/web` — SW-IDP frontend

Vite + React SPA written in plain JavaScript, the only frontend artefact in the project. The SPA talks **only** to the Spring Cloud Gateway at runtime — see `design/STACK.md`.

## Stack at a glance

| Concern | Tool |
|---|---|
| Build / dev server | Vite |
| Framework | React 18 |
| Language | JavaScript (ES2022+) — **not** TypeScript |
| Styling | Tailwind v4 (CSS-first `@theme`) |
| Icons | lucide-react |

Routing, server-state (TanStack Query), forms (react-hook-form + zod), and the shared primitive set are added by their own foundation issues — they are intentionally **not** wired yet.

## Common commands

```bash
# from apps/web/
npm install        # first run only
npm run dev        # start the dev server on http://localhost:5173
npm run build      # production build to ./dist
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run format     # prettier --write
```

## Design tokens

Material-3 tokens are lifted from `design/REQUIREMENTS.md` §5 and `design/stitch-export/aegis_core/DESIGN.md` into `src/index.css` via Tailwind v4's `@theme` directive. They are usable from any component as the standard utilities — e.g. `bg-surface`, `text-on-surface-variant`, `rounded-xl`, `font-headline`.

Two helper utilities are defined alongside the tokens:

- `glass-panel` — the `rgba(255, 255, 255, 0.85)` + `backdrop-blur(24px)` preset used by login cards and modals.
- `monolith-gradient` — the `#000 → #001b3d` gradient used by the primary button.

> **Radii caveat.** `rounded-full` resolves to `0.75rem`, not a true circle (this matches the design's M3 shape token). For genuinely circular elements (avatars, status dots), use `rounded-[100%]`.

## Fonts

Manrope (headline) and Inter (body / label) load from Google Fonts via `<link>` tags in `index.html`. Use them via the `font-headline` / `font-body` utilities from the `@theme` block.

## Where new code goes

This is the only foundation issue that's allowed to invent layout. Every later FE issue mirrors patterns established by issue #2 (`[foundation] Build shared primitive set + AdminLayout`). Until that lands, `src/App.jsx` is a placeholder that proves the build chain works.

## Where to look when in doubt

| Question | Doc |
|---|---|
| Which tool / library | `design/STACK.md` |
| Visual contract for a screen | `design/stitch-export/stitch_system_user_interface/<screen>/code.html` |
| Design tokens | `design/REQUIREMENTS.md` §5 |
| API topology | `design/STACK.md` ("Spring Cloud") + `design/ARCHITECTURE.md` |
