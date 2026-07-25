# CodeFootPrint Frontend — Phase 8

React (Vite) + Tailwind CSS dashboard, matching the UI/UX design spec.

## Pages built

| Route | Page | Notes |
|---|---|---|
| `/` | Landing | Hero, features, how-it-works, footer |
| `/login` | Login | Centered card form |
| `/register` | Register | Centered card form |
| `/dashboard` | Dashboard | Stat cards, weekly chart, recent activity table |
| `/dashboard/new-analysis` | New Analysis | Form + step-by-step loading screen |
| `/dashboard/history` | History | Full table with view/delete |
| `/dashboard/report/:id` | Report Viewer | Every section from the design doc's report page |
| `/dashboard/profile` | Profile | User info + stats |

## Folder structure

```
src/
├── api/            axios client + one file per backend resource (auth, analysis, dashboard)
├── context/        AuthContext.jsx - global login state
├── components/     Button, Input, Card, Badge, Spinner, ProgressBar, EmptyState,
│                   DashboardLayout (sidebar+navbar shell), ProtectedRoute
├── pages/           the 8 pages listed above
├── App.jsx          all routes
└── main.jsx         entry point
```

## How auth works

1. `AuthContext.jsx` holds the logged-in user in memory + localStorage.
2. `api/client.js`'s request interceptor automatically attaches the JWT
   to every API call — pages never touch the token directly.
3. Its response interceptor watches for `401` responses (expired/invalid
   token) and automatically logs the user out and redirects to `/login`.
4. `ProtectedRoute.jsx` wraps every `/dashboard/*` route and redirects to
   `/login` if nobody's signed in.

## Design tokens

`tailwind.config.js` defines the exact colors from the design doc
(`bg`, `bg-secondary`, `bg-card`, `text-primary/secondary/muted`, `success`,
`warning`, `error`, `info`, primary blue `#3B82F6`) so every component pulls
from the same palette instead of drifting toward generic Tailwind grays.

## Setup steps

1. Make sure the backend (Phases 1–7) is running on port 5000 — `vite.config.js`
   proxies all `/api/...` requests there in development.
2. Install and run:
   ```
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`.

## What I verified

- **`npm run build` succeeds with zero errors** — every import across all
  8 pages and every component resolves correctly, and Tailwind generated
  14.32 kB of real CSS from the custom color classes (proof the palette
  config is wired up correctly, not just present in a config file nobody uses).
- **`npm run preview` serves the built app correctly** — confirmed the HTML,
  JS bundle, and CSS bundle all return `200` with the right content.

**What I could not verify:** actual visual rendering in a browser. This
sandbox doesn't have a headless browser available (Playwright's browser
binaries live on a domain outside what I can reach here), so I can't
produce a real screenshot. Everything is built to spec against the design
doc's exact colors, spacing, and layout descriptions, and it compiles and
serves cleanly — but you should do a visual pass with `npm run dev` to
catch anything a compiler can't, like awkward spacing or a component that
looks different than intended.

## Known simplifications (documented, not hidden)

- The "New Analysis" loading screen advances through steps on a timer
  (1.5s each) rather than real backend progress events — the backend
  doesn't emit progress currently (WebSockets for live progress are listed
  as a future enhancement in the architecture doc, out of MVP scope).
- The dashboard's "Analyses This Week" chart is built from your analysis
  history's timestamps client-side, since there's no dedicated backend
  endpoint for time-series data yet.

## Next: Phase 9

Security & Optimization — hardening the backend for production (rate
limiting is one of the few security items from the rules doc not yet wired
in), plus any frontend polish.
