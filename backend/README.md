# CodeFootPrint Backend — Phase 1: Project Foundation

## What's in this phase

- Express server with ES Modules (`"type": "module"` in package.json)
- Security middleware: Helmet + CORS
- JSON body parsing
- Centralized env config (`src/config/env.js`)
- Simple logger (`src/utils/logger.js`)
- Global error handler with consistent JSON error shape
- `/api/health` endpoint
- Prisma initialized (schema only — no models yet, that's Phase 2)

## Folder structure

```
src/
├── config/        env.js (reads process.env once, everyone else imports from here)
├── controllers/    (empty for now — added in Phase 2)
├── middleware/     errorMiddleware.js
├── routes/         (empty for now — added in Phase 2)
├── services/        (empty for now — added in Phase 2)
├── utils/          logger.js
├── validators/      (empty for now — added in Phase 2)
├── prisma/         schema.prisma
├── app.js          Express app config (middleware, routes, error handler)
└── server.js       Entry point — just starts the server
```

## Setup steps (run these on your own machine)

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real values:
   ```
   cp .env.example .env
   ```
   At minimum for Phase 1 you need `PORT` and `DATABASE_URL` (a real PostgreSQL
   connection string). The AI and GitHub keys aren't needed until later phases.

3. Generate the Prisma client (downloads engine binaries — needs full internet
   access, which is why I couldn't run this in the sandboxed environment I
   built this in):
   ```
   npm run prisma:generate
   ```

4. Start the dev server:
   ```
   npm run dev
   ```

5. Confirm it's alive:
   ```
   curl http://localhost:5000/api/health
   ```
   You should see:
   ```json
   {"success":true,"message":"CodeFootPrint API is running","timestamp":"..."}
   ```

## Why app.js and server.js are separate files

`app.js` only *configures* Express (middleware, routes, error handling) and
exports it — it never calls `.listen()`. `server.js` imports that configured
app and is the only file that actually starts listening on a port. This
split matters later: it lets us write automated tests against `app.js`
without needing to open a real network port for every test.

## Next: Phase 2

Database schema (User model), registration, login, password hashing with
bcrypt, and JWT authentication.

---

# Phase 2: Database & Authentication

## What's in this phase

- `User` model added to `src/prisma/schema.prisma`
- Prisma client singleton (`src/config/database.js`)
- `AppError` class so services can throw errors with specific HTTP status codes
- Input validation with `express-validator` (`src/validators/authValidator.js`)
- `authService.js` — register, login, getUserById (all the real business logic)
- `authController.js` — thin HTTP layer that calls the service
- `authMiddleware.js` — protects private routes by checking the JWT
- Routes:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me` (protected — requires `Authorization: Bearer <token>`)

## How a request flows (register example)

```
POST /api/auth/register
  -> registerValidationRules (checks name/email/password format)
  -> validateRequest (rejects with 400 if validation failed)
  -> register controller (reads req.body)
  -> registerUser service (checks for existing email, hashes password,
     saves to DB, generates JWT)
  -> controller sends { user, token } back as JSON
```

## Setup steps (run these on your own machine)

1. Install the new dependencies (already in package.json):
   ```
   npm install
   ```

2. Make sure `.env` has a real `DATABASE_URL` and set a real `JWT_SECRET`
   (any long random string — don't use the placeholder in production).

3. Generate the Prisma client and run the migration. I could not run this
   step myself: my sandboxed environment doesn't have network access to
   `binaries.prisma.sh`, which Prisma needs to download its engine. This
   will work fine on your machine with normal internet access.
   ```
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Start the server:
   ```
   npm run dev
   ```

5. Test it:
   ```bash
   # Register
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Earnest","email":"earnest@example.com","password":"mypassword123"}'

   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"earnest@example.com","password":"mypassword123"}'

   # Access protected route (replace TOKEN with the token from login)
   curl http://localhost:5000/api/auth/me \
     -H "Authorization: Bearer TOKEN"
   ```

## What I verified without Prisma available

Since I couldn't generate the Prisma client in my sandbox, I proved the
underlying logic separately: I stood up a real PostgreSQL 16 database,
created a `users` table matching the exact Prisma schema, and ran the same
bcrypt hash/compare and JWT sign/verify logic that `authService.js` and
`authMiddleware.js` use. Confirmed:

- Password hashing and correct-password login succeed
- Wrong-password login is correctly rejected
- Valid tokens decode to the right user id
- Invalid/garbage tokens are correctly rejected

I also confirmed input validation rejects bad requests (invalid email,
short password) with `400` before ever reaching the database.

## Next: Phase 3

GitHub Integration — fetching commits, diffs, and contributors from the
GitHub REST API.

---

# Phase 3: GitHub Integration

## What's in this phase

- `src/config/github.js` — pre-configured axios client for GitHub's API (auth header, correct Accept header)
- `src/utils/helpers.js` — `parseRepoUrl()` pulls `{owner, repo}` out of any GitHub URL format
- `src/validators/analysisValidator.js` — validates `repoUrl` and `githubUsername` before anything else runs
- `src/services/gitService.js` — the real GitHub integration:
  - `fetchRepository(owner, repo)` — confirms the repo exists
  - `fetchCommitsByUser(owner, repo, username)` — paginates through ALL commits by one author
  - `fetchCommitDetails(owner, repo, sha)` — gets the full diff for one commit (used in Phase 4)
  - `fetchContributors(owner, repo)` — lists everyone who has contributed
  - `fetchFileContent(owner, repo, path)` — gets a file's content, decoded from base64
- `src/controllers/analysisController.js` + `src/routes/analysisRoutes.js` — a protected `POST /api/analysis` endpoint that proves the above works together (full AI pipeline comes in later phases)

## How pagination works

GitHub returns commits in pages of up to 100. `fetchCommitsByUser` keeps
requesting `page: 1, 2, 3...` and appending results until GitHub returns
fewer than 100 items in a page — that's the signal we've reached the end.

## How errors are handled

`handleGithubError()` in `gitService.js` turns GitHub's raw HTTP errors into
clean, predictable `AppError`s:
- `404` from GitHub → `404 AppError` ("repository not found")
- `403` from GitHub → `429 AppError` ("rate limit exceeded")
- anything else → `502 AppError` ("failed to reach GitHub")

This means the rest of the app never has to know or care what GitHub's API
looks like — it just sees a normal `AppError` with a clear message and status.

## What I verified

1. **`parseRepoUrl()`** — tested with a full URL, a `.git`-suffixed URL, and
   garbage input. All three behaved correctly.
2. **Real GitHub API calls** — I ran `gitService.js` live against
   `github.com/octocat/Hello-World`. `fetchRepository` and `fetchContributors`
   both work when a valid token or available rate limit is present. During my
   test, this sandbox's shared IP had **already exhausted its 60/hour
   anonymous GitHub rate limit** (confirmed via `X-RateLimit-Remaining: 0`
   header) before I even ran my test — so instead of a successful fetch, I
   got a real `403` from GitHub. That's actually a good test: it proved
   `handleGithubError()` correctly converts a genuine GitHub rate-limit
   response into a clean `429 AppError`. I was not able to demonstrate the
   successful-fetch path live because of this — you should verify that
   yourself once you add a real `GITHUB_TOKEN` in `.env` (a personal access
   token raises your limit to 5,000/hour and will very likely succeed).
3. **Validation logic** — tested in isolation (bypassing the parts of the
   app that need Prisma, which still can't run in this sandbox): valid
   input passes, a malformed repo URL is rejected, a missing username is
   rejected, and a username with invalid characters is rejected. All four
   returned the correct `400` messages.
4. **Auth protection** — confirmed `POST /api/analysis` requires a valid
   JWT before validation even runs (consistent with Phase 2's middleware).

## Setup steps

1. Add a real GitHub Personal Access Token to `.env` as `GITHUB_TOKEN` (no
   special scopes needed for public repos — just generate a basic token at
   github.com/settings/tokens). This raises your rate limit from 60/hour to
   5,000/hour.
2. Once Prisma is generated (see Phase 2 setup) and the server is running,
   test the endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/analysis \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_FROM_LOGIN" \
     -d '{"repoUrl":"https://github.com/octocat/Hello-World","githubUsername":"octocat"}'
   ```

## Next: Phase 4

Contribution Analysis Engine — parsing the raw commit diffs from
`fetchCommitDetails()` into structured stats (lines added/removed, files
touched, functions detected) and filtering out boilerplate/setup commits.

---

# Phase 4: Contribution Analysis Engine

## What's in this phase

- `src/utils/helpers.js` — added `batchProcess()`, which runs async work over
  a list in small controlled-size chunks (protects against GitHub rate limits)
- `src/utils/diffParser.js`:
  - `parseCommitDiff(commit)` — turns one raw GitHub commit into `{ sha, message, date, filesModified, linesAdded, linesRemoved, functionsDetected }`
  - `isSetupCommit(parsedCommit)` — flags commits that are just project setup or lockfile churn (by message keyword, e.g. "initial commit", OR by touching only boilerplate files like `package-lock.json`)
- `src/utils/diffAggregator.js`:
  - `aggregateContributions(parsedCommits)` — combines many parsed commits into totals: total commits, lines added/removed, unique files touched, top modified files, unique functions detected
- `src/services/analysisService.js` — the orchestrator. This is the real
  pipeline: fetch commits → fetch each commit's diff (in batches of 5) →
  parse every diff → filter out setup commits → aggregate the rest
- `analysisController.js` and `analysisRoutes.js` updated to call this real
  pipeline instead of the Phase 3 placeholder

## Why the parser and aggregator are separate from the service

`diffParser.js` and `diffAggregator.js` contain **pure functions** — given
the same input, they always produce the same output, and they never touch
the network or a database. That's intentional: it means I could write real,
deterministic tests for them using fake commit data, without needing GitHub
or a live server at all. `analysisService.js` is the only piece that
actually coordinates network calls (via `gitService.js`) with this pure logic.

## What I verified

I wrote 14 targeted tests using fake commit data shaped exactly like GitHub's
real API responses (same `files`, `patch`, `additions`/`deletions` structure),
and ran them for real. All 14 passed:

- Correct sha/message/date extraction
- Correct lines-added and lines-removed totals
- Function name extraction from both `function foo()` and `const foo = () =>` styles
- A real feature commit is correctly NOT flagged as setup
- An "Initial commit" message IS correctly flagged as setup
- A commit touching only `package-lock.json` IS correctly flagged as setup
- Aggregation correctly sums totals across multiple commits
- Aggregation correctly ranks the most-touched file first
- Aggregation correctly deduplicates function names across commits
- `batchProcess` processes all items, in order, across multiple batches

This gives high confidence in the analysis logic itself. The one thing this
doesn't test is `analysisService.js`'s live GitHub calls (same rate-limit
constraint from Phase 3 applies) — that part you should verify once you add
a real `GITHUB_TOKEN` and Prisma is generated on your machine.

## Setup / testing steps

Once Prisma is generated (see Phase 2) and you have a real `GITHUB_TOKEN`
(see Phase 3), the full pipeline is live at the same endpoint as before:

```bash
curl -X POST http://localhost:5000/api/analysis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_FROM_LOGIN" \
  -d '{"repoUrl":"https://github.com/octocat/Hello-World","githubUsername":"octocat"}'
```

You should now get back real aggregated contribution stats instead of just
a commit list.

## Next: Phase 5

AI Report Generation — sending this aggregated data to Groq (with Gemini
and Cohere as fallbacks) to produce the structured, interview-ready report.

---

# Phase 5: AI Report Generation

## What's in this phase

- `src/config/ai.js` — endpoint, model, and API key config for all three providers, plus one shared `AI_TEMPERATURE` constant (kept low for consistent output, per the rules doc)
- `src/utils/aiPromptBuilder.js` — `buildAnalysisPrompt(analysisData)`, a pure function that turns aggregated contribution stats into a system prompt + user prompt, explicitly describing the exact JSON shape we want back
- `src/utils/aiResponseParser.js` — `safeParseAIResponse(rawText)`: strips markdown code fences the AI might add, parses the JSON safely, and checks that every required report field is present before trusting it
- `src/services/aiService.js` — one caller function per provider (`callGroq`, `callGemini`, `callCohere`, each returning raw text), plus `generateAIReport()` which tries them **in priority order** (Groq → Gemini → Cohere) and only throws if all three fail
- `analysisService.js` updated — after aggregating stats, it now calls `generateAIReport()` and includes the AI report in the final result

## How the fallback works

```
generateAIReport(data)
  -> try Groq   -> success? return report
                -> failure? log warning, continue
  -> try Gemini -> success? return report
                -> failure? log warning, continue
  -> try Cohere -> success? return report
                -> failure? log warning, continue
  -> all failed -> throw one AppError (502) listing all 3 failure reasons
```

Each provider function returns plain text; `safeParseAIResponse()` is the
single shared gatekeeper that all three have to pass through, so no
provider gets special treatment or looser validation.

## What I verified

10 tests on the pure logic (prompt builder + response parser), all passing:
- Prompt correctly includes repo name, stats, and detected functions
- System prompt correctly instructs JSON-only output
- Parser correctly handles clean JSON, ` ```json ` fences, and plain ` ``` ` fences
- Parser correctly rejects invalid JSON, an incomplete report (missing fields), and an empty response — all with a `502` status

I also ran `generateAIReport()` **live**, for real, against all three actual
provider endpoints (Groq, Gemini, Cohere). Since `.env` still has the
placeholder API keys, all three genuinely rejected the request with a real
`403`. That's not a wasted test — it's the best possible proof that the
fallback logic works correctly: I confirmed the log output shows it tried
Groq, then Gemini, then Cohere, in that exact order, and the final error
correctly names and combines all three failure reasons.

**What I couldn't verify:** an actual successful AI-generated report, since
that requires real API keys, which I don't have. Once you add real keys to
`GROQ_API_KEY` / `GEMINI_API_KEY` / `COHERE_API_KEY` in `.env`, the very
first successful provider call will confirm the happy path — everything
around it (prompt, parsing, validation) is already proven to work.

## Setup steps

1. Get free API keys:
   - Groq: [console.groq.com](https://console.groq.com)
   - Gemini: [aistudio.google.com](https://aistudio.google.com)
   - Cohere: [dashboard.cohere.com](https://dashboard.cohere.com)
2. Add them to `.env` as `GROQ_API_KEY`, `GEMINI_API_KEY`, `COHERE_API_KEY`.
3. Run the same analysis endpoint as before — the response now includes a
   full `aiReport` object:
   ```bash
   curl -X POST http://localhost:5000/api/analysis \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_FROM_LOGIN" \
     -d '{"repoUrl":"https://github.com/octocat/Hello-World","githubUsername":"octocat"}'
   ```

## Next: Phase 6

Database Integration — saving completed analyses (including the AI report)
to PostgreSQL and associating them with the logged-in user.

---

# Phase 6: Database Integration

## What's in this phase

- `Analysis` model added to `src/prisma/schema.prisma`, with a foreign key
  to `User` and `onDelete: Cascade` (deleting a user automatically deletes
  their analyses)
- `analysisService.js` gained four new functions:
  - `saveAnalysis(userId, repoUrl, githubUsername, analysisResult)` — saves a completed analysis
  - `getAnalysisHistory(userId)` — lists a user's analyses, newest first, summary fields only
  - `getAnalysisById(userId, analysisId)` — fetches one full analysis, but only if it belongs to that user
  - `deleteAnalysis(userId, analysisId)` — deletes one analysis, same ownership check
- Routes, all protected by `authMiddleware`:
  - `POST   /api/analysis` — run analysis, then save it
  - `GET    /api/analysis` — list your analysis history
  - `GET    /api/analysis/:id` — view one full analysis
  - `DELETE /api/analysis/:id` — delete one analysis

## Why we store a trimmed report, not the full raw commit list

`toStorableReport()` in `analysisService.js` keeps the AI report and the
aggregated stats, but drops the full commit-by-commit array. That data is
large, reconstructable from GitHub at any time, and not something a history
view or report page actually needs to render. This follows the rules doc:
"store only necessary data."

## Why ownership checks matter here

`getAnalysisById` and `deleteAnalysis` both filter by `{ id, userId }`
together, not just `{ id }`. If the analysis doesn't exist OR belongs to
someone else, both cases return the same `404 Analysis not found` — this
stops one user from even confirming that a specific analysis ID exists in
someone else's account.

## What I verified

Same approach as Phase 2, since Prisma's client still can't be generated in
this sandbox: I built a real `analyses` table in PostgreSQL with the exact
same columns, foreign key, and cascade-delete relationship as the Prisma
schema, then ran 9 tests against it for real:

- Saving an analysis creates a row with a generated id
- History returns the correct count, ordered most-recent-first
- A user can fetch their own analysis, and the full report JSON survives the round-trip intact
- **A different user is correctly blocked from accessing someone else's analysis** (this is the security-critical one)
- Deleting an analysis actually removes it
- Deleting a user automatically deletes their analyses via cascade (confirmed a row existed before, and was gone after, with no explicit delete of the analysis itself)

All 9 passed. The one thing this doesn't cover is the literal Prisma query
syntax — but the relational logic, ownership enforcement, and cascade
behavior it depends on are all proven against a real database.

## Setup steps

1. Once you can run `npx prisma generate` and `npx prisma migrate dev` on
   your machine (see Phase 2), the `analyses` table will be created
   automatically from the schema.
2. Full flow test:
   ```bash
   # Run and save an analysis
   curl -X POST http://localhost:5000/api/analysis \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"repoUrl":"https://github.com/octocat/Hello-World","githubUsername":"octocat"}'

   # View your history
   curl http://localhost:5000/api/analysis -H "Authorization: Bearer YOUR_TOKEN"

   # View one analysis (replace ANALYSIS_ID)
   curl http://localhost:5000/api/analysis/ANALYSIS_ID -H "Authorization: Bearer YOUR_TOKEN"

   # Delete it
   curl -X DELETE http://localhost:5000/api/analysis/ANALYSIS_ID -H "Authorization: Bearer YOUR_TOKEN"
   ```

## Next: Phase 7

Dashboard API — profile info, dashboard statistics, and the endpoints the
frontend dashboard will actually consume.

---

# Phase 7: Dashboard API

## What's in this phase

- `Analysis` model gained a `processingTimeMs` column, so we can report
  "average analysis time" on the dashboard (design doc requirement)
- `analysisController.js` now measures how long `analyzeContributions()`
  takes (`Date.now()` before/after) and saves that duration
- `src/services/dashboardService.js`:
  - `getUserProfile(userId)` — name, email, member-since date, total analyses run
  - `getDashboardStats(userId)` — the four stat cards from the design doc: total analyses, distinct repositories analyzed, average analysis time, and the most recent analysis
- `dashboardController.js` + `dashboardRoutes.js`:
  - `GET /api/dashboard/profile`
  - `GET /api/dashboard/stats`
  - both protected by `authMiddleware`

## Why "repositories analyzed" needs `distinct`

If a user analyzes the same repo three times, that's 3 analyses but only 1
repository. `getDashboardStats` uses Prisma's `distinct: ["repositoryUrl"]`
to count unique repos separately from total analysis runs — otherwise the
"Repositories Analyzed" card would be misleading.

## What I verified

Same real-database approach as Phases 2 and 6: rebuilt the `analyses` table
with the new `processing_time_ms` column, inserted 3 analyses for one user
(2 against the same repo, 1 against a different repo, with different
processing times and timestamps), then ran 6 tests:

- A brand-new user correctly shows 0 analyses
- Total analysis count is correct (3)
- Distinct repository count is correct (2, not 3 — proves the dedup logic works)
- Average processing time is calculated correctly: (4000+6000+8000)/3 = 6000ms
- "Last analysis" correctly identifies the most recently created one, not just the last one inserted
- Profile's total-analyses count correctly reflects the real data

All 6 passed.

## Setup steps

Once Prisma is generated and migrated on your machine:
```bash
curl http://localhost:5000/api/dashboard/profile -H "Authorization: Bearer YOUR_TOKEN"
curl http://localhost:5000/api/dashboard/stats -H "Authorization: Bearer YOUR_TOKEN"
```

## Next: Phase 8

Frontend Development — the React dashboard, auth pages, analysis flow, and
report viewer described in the design doc.

---

# Phase 9: Security & Optimization

## What's in this phase

- `src/middleware/rateLimiter.js` — two rate limiters, per the rules doc:
  - `authLimiter`: 10 requests per 15 minutes, applied to `/auth/register` and `/auth/login`
  - `analysisLimiter`: 20 requests per hour, applied to `POST /api/analysis`
- `src/config/env.js` gained `validateEnv()` — checks that required env vars
  (currently `JWT_SECRET`) are actually set, and throws a clear error if not
- `server.js` calls `validateEnv()` before starting, and exits immediately
  with a clear log message if something required is missing, instead of
  starting up and failing confusingly later
- `errorMiddleware.js` now recognizes two common Prisma error codes and
  translates them into clean responses instead of a generic `500`:
  - `P2002` (unique constraint violation) → `409` "A record with this value already exists"
  - `P2025` (record not found) → `404` "Record not found"
- **Cleanup:** removed the full raw commit list from the analysis API
  response (`analysisService.js`) — it was being spread into every `POST
  /api/analysis` response even though nothing in the frontend uses it (the
  trimmed, stored version is fetched separately via `GET /api/analysis/:id`).
  Also fixed a frontend bug where `Spinner` silently ignored a `style` prop
  it was being passed in two places — it now takes a proper `size` prop.

## Why fail-fast env validation matters

Before this phase, a missing `JWT_SECRET` wouldn't cause an error until
someone tried to log in — `jwt.sign(payload, undefined)` doesn't throw
immediately in all cases and produces confusing downstream failures.
Catching it at startup means the very first thing you see is a clear,
correct error message, not a mystery bug three requests later.

## What I verified

All three pieces are pure logic or plain Express, so none of them are
blocked by the Prisma-client sandbox limitation — I ran all of them for
real:

- **Env validation**: confirmed `validateEnv()` passes silently when
  `JWT_SECRET` is set, and throws the exact expected message when it's blank.
- **Rate limiting**: built a tiny 3-request test limiter, fired 5 requests
  at a real running Express server, and confirmed requests 1-3 succeeded
  (`200`) while requests 4-5 were correctly blocked (`429`). Same mechanism
  powers the real `authLimiter`/`analysisLimiter`, just with the actual
  production thresholds.
- **Prisma error mapping**: ran `errorMiddleware.js` against fake `P2002`
  and `P2025` errors through a real Express app and confirmed they map to
  `409`/`404` with clean messages, while a normal error still falls back
  to its own status and message unchanged.

All tests passed. I also did a full manual read-through of every backend
file's imports looking for anything unused — the codebase was already
clean going into this phase (no dead imports found), aside from the one
real simplification described above (dropping the unused raw commit list
from the API response).

## Setup steps

No new setup required beyond what previous phases already need. The rate
limits and validation are active automatically once the server starts.

To see rate limiting in action, send 11+ login requests within 15 minutes —
the 11th will return `429` with `"Too many attempts. Please try again in
15 minutes."`

## Next: Phase 10

Testing & Deployment — final verification pass and deploying the backend
and frontend.

---

# Post-Phase 9: Prisma 7 Compatibility

Prisma released a major version (v7) with breaking changes after this
project was originally built. Three things changed:

1. `schema.prisma`'s datasource no longer holds `url` — moved to a new
   `prisma.config.ts` file at the project root.
2. The old `package.json` `"prisma": { "schema": ... }` shortcut is gone —
   also replaced by `prisma.config.ts`.
3. `PrismaClient` now requires a **driver adapter** to be constructed — it
   can no longer read the connection string on its own. `database.js` now
   builds a `PrismaPg` adapter (`@prisma/adapter-pg` + `pg`) and passes it
   in: `new PrismaClient({ adapter })`.

`database.js` also imports `@prisma/client` as a namespace (`import *
as prismaPkg`) rather than a named import, since the generated client can
resolve as CommonJS in some local Node/npm setups, which breaks a direct
named ESM import even though the export genuinely exists.

---

# Pipeline Optimization Pass

After the app was running end-to-end, large repositories (e.g.
`microsoft/TypeScript`) were exceeding the AI model's token limit, and
analysis was slow because far more data was being fetched and processed
than the report actually needed. This pass targeted three things: fewer
GitHub requests, a smaller AI prompt, and less unnecessary AI output —
without changing routes, the database schema, auth, or the frontend.

## What changed and why

**`gitService.js`** — `fetchCommitsByUser` now stops paginating at 500
commits instead of fetching every commit a contributor has ever made. On
a huge repo, that could otherwise mean thousands of API calls before we'd
even decided how many commits to actually analyze.

**`analysisService.js`** — the real fix. Fetching full commit *details*
(diff/patch text included) is the expensive, slow, token-heavy step. It
now only fetches details for the most recent **100** commits
(`MAX_COMMITS_TO_ANALYZE`), instead of every commit returned. GitHub
already returns commits newest-first, so this is a plain array slice, not
a different query — and it directly satisfies "analyze the latest commits"
as a representative subset for huge repos.

**`aiPromptBuilder.js`** — rewritten with three changes:
- `contributionStatistics` was removed from the JSON shape the AI is asked
  to produce. The backend already computes those exact numbers
  (`aggregateContributions`), and — checked directly — the frontend's
  `ReportViewer.jsx` reads them from the backend's own data, never from the
  AI's output. Asking the AI to also generate them was wasted output tokens
  and a pure hallucination risk with zero use.
- `functionsDetected` is capped to the top 25 before being included in the
  prompt (previously unbounded — a huge repo could mean hundreds of
  function names in a single prompt). `topModifiedFiles` is capped to 8.
- A simple token-safety check estimates the prompt's token count (~4
  characters per token) and, in the rare case it's still over a 2,000
  token budget after the caps above, halves the function list repeatedly
  until it fits — a graceful degradation instead of a failed request.

**`aiResponseParser.js`** — `contributionStatistics` removed from the
required-fields check, matching the prompt no longer asking for it.

**`gitService.js` (cleanup)** — removed `fetchFileContent`, which was
scaffolded in Phase 3 but never actually called anywhere in the pipeline.
Raw file contents were never sent to the AI to begin with; this just
removes the dead code that could have enabled it later by accident.

## What was already fine (no change needed)

- GitHub requests were already parallelized: `fetchRepository` and
  `fetchCommitsByUser` already run together via `Promise.all`, and commit
  detail fetches already run in controlled concurrent batches
  (`batchProcess`, batch size 5) rather than one-at-a-time.
- Raw file contents and full diff patch text were never sent to the AI —
  only aggregated stats were, even before this pass.

## What I verified

Ran 8 tests against a simulated large-repo dataset (500 detected
functions, 50 top files — modeling the `microsoft/TypeScript`-scale
scenario from the original bug report):

- The full prompt for that simulated huge repo comes in at **~515
  estimated tokens** — comfortably under the 2,000 token budget, and far
  under the 12,000 token model limit that was failing before.
- Confirmed the prompt does NOT contain all 500 function names (bounded
  slice only) and does NOT ask for `contributionStatistics`.
- Directly compared the old unbounded approach against the new one on the
  same simulated data: **~85% reduction** in the data portion of the
  prompt — past the requested 70% target.
- Confirmed the response parser correctly accepts a valid report that
  omits `contributionStatistics` (no longer required).
- Confirmed a small repo (2 functions, 1 file) is completely unaffected —
  same output as before, no regression from the new limits.

All 8 passed. As with earlier phases, I could not test an actual live
GitHub fetch of a huge real repository (rate limits) or a real AI response
(no API keys) in this sandbox — but the logic that determines what data
gets sent, and how much, is proven correct against realistic data shaped
exactly like the failure case described.

---

# Final Polish: Explainable, Evidence-Based Reports

Goal: every AI conclusion in the report must be traceable back to real
repository data — no invented percentages, no unsupported scores.

## What changed and why

**`diffAggregator.js`** — added `getContributionAreas()`. This is a
deterministic, backend-only calculation: every modified file's directory
is mapped to a human-readable category (e.g. `src/compiler/checker.ts` →
"Compiler"; generic wrapper directories like `src`/`lib` are skipped in
favor of the next meaningful segment). Root-level files are routed to
"Configuration" (known lock/config file patterns) or "Root" — this avoids
a bug caught during testing where a file like `package-lock.json` was
title-cased into the nonsensical label "Package Lock.Json". Percentages
are real: `(files in category) / (total files touched) × 100`. This
entirely replaces the AI's previous invented `workBreakdown` — the
"Contribution Breakdown" numbers in the report are now something you can
answer "how was this calculated?" for, precisely.

**`analysisService.js`** — assembles a small `evidenceSummary` object
(commits analyzed, files modified, major directories, representative
files, technologies detected) purely from backend-computed data. This
powers the report's new "Evidence Used" section and is also fed into the
AI prompt so the AI grounds its output in real names instead of generic
language.

**`aiPromptBuilder.js`** — the report schema requested from the AI no
longer includes any numeric field. `technicalSkills` now asks for a level
(`Beginner`/`Intermediate`/`Advanced`/`Expert`) plus an `evidence` array
that must cite real files/directories. `codeQuality` asks for qualitative
observations (`Consistent`, `Strong`, `Moderate`...) instead of 0-100
scores. `candidateOverview` gained a `reasoning` array — short, specific
bullets instead of unsupported praise. `hiringRecommendation.justification`
became `reasons` — an array, matching the "✓ bullet point" format
requested. The prompt explicitly instructs: never output a numeric score,
ground every skill's evidence in real data, ground interview questions in
the contributor's actual files/areas, and avoid superlatives not supported
by the data.

**`aiResponseParser.js`** — `workBreakdown` removed from required fields
(replaced by the backend's own `contributionAreas`).

**Frontend `ReportViewer.jsx`** — rewritten to match: Technical Skills now
shows a level badge + evidence bullets instead of a numeric progress bar.
Contribution Breakdown now reads from the backend's real
`contributionAreas` percentages instead of the AI's old `workBreakdown`.
Code Quality shows qualitative rows instead of scored progress bars.
Hiring Recommendation shows a bulleted reasons list. A new "Evidence Used"
card was added at the bottom of the report, sourced entirely from
`evidenceSummary`. `ProgressBar` was removed from `ui.jsx` as dead code,
since nothing in the app uses numeric scores anymore.

## What I verified

- **Categorization logic** (12 tests): correctly groups files by directory
  into readable categories, correctly routes root-level config/lock files
  instead of producing broken labels, correctly skips generic wrapper
  directories (`src`) in favor of the meaningful segment beneath them,
  handles empty input without crashing.
- **Prompt + schema** (12 tests): confirmed the prompt includes real
  backend-calculated percentages and real file names, confirmed it
  explicitly forbids numeric scores, confirmed the schema no longer
  requests `workBreakdown` or `contributionStatistics`, confirmed the
  parser accepts a well-formed response matching the new shape and still
  rejects an incomplete one.
- **Real React rendering** (8 tests): rendered the actual report-body JSX
  logic through `react-dom/server` with both a realistic full report and a
  sparse/edge-case one (empty arrays, minimal data). Confirmed no crashes,
  confirmed real data appears correctly in the output, and — importantly —
  confirmed the literal strings `"undefined"` and `"NaN"` never leak into
  the rendered output, which would have indicated an unsafe field access.
- **Full production build**: `npm run build` succeeds with zero errors
  after all changes, including the `ProgressBar` removal.

32 tests total, all passing. What I could not verify: an actual AI
provider's real output against this new prompt (no API keys in this
sandbox) — you should do one live run and read through the report once you
have real keys configured, since prompt-following quality from a real
model is the one thing that can only be judged by seeing it.
