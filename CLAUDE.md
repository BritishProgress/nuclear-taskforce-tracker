# CLAUDE.md

Guidance for Claude Code working in this repo.

## What this is

A public tracker of the UK government's progress against the 47 Nuclear Regulatory Taskforce recommendations. Live at [nuclear.britishprogress.org](https://nuclear.britishprogress.org). Maintained by the Centre for British Progress (owners: Pedro & Matthew).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Radix UI + lucide-react · js-yaml · ExcelJS (exports) · `@vercel/analytics`. Package manager: **npm**. Deployed on Vercel; default branch `master`.

## Commands

```bash
npm install
npm run dev      # localhost:3000
npm run build
npm run lint
```

## Data model — the one thing that matters

All tracker content is in a single file: **`public/taskforce.yaml`**. There is no database and no admin UI — editing the YAML and pushing is the entire update workflow, and every change is therefore a reviewable git diff.

- It's loaded server-side in `lib/yaml.ts`, shaped for the UI in `lib/data.ts`, and typed in `lib/types.ts`. Read `lib/types.ts` before editing the YAML so the shape stays valid.
- Top level: `last_updated`, `status_scales`, `sources`, `chapters`, `proposals`, `recommendations`, `owner_info`.
- Each recommendation has a `code` (e.g. `R05`), an `overall_status` (`status`, `last_updated`, `confidence`, `summary`), and an `updates[]` list.

### Updating the tracker

1. Change a status: edit that recommendation's `overall_status.status` and `overall_status.last_updated`.
2. Add news: append to its `updates[]` (`date`, `status`, `title`, `description`, optional `links[]` and `source_key`).
3. Add a source: add a keyed entry under `sources` and reference it via `source_key`.
4. Bump the top-level `last_updated`.
5. `npm run dev`, confirm it parses and the recommendation renders, then commit and push to `master` (Vercel auto-deploys).

YAML is whitespace-sensitive — if the build fails after an edit, check indentation first. `govt-response-updates.md` holds the research notes behind the latest batch of status changes; `PROJECT_PLAN.md` documents the original build.

## Routes of note

- `app/api/og/*` — dynamic Open Graph images (per recommendation / update).
- `app/api/export/*` — CSV/Excel exports (recommendations, updates, departments).

## Config

No secrets. Only public `NEXT_PUBLIC_*` values (`NEXT_PUBLIC_TWITTER_SITE_HANDLE`, `NEXT_PUBLIC_TWITTER_CREATOR_HANDLE`, optional `NEXT_PUBLIC_SITE_URL`) — safe to commit.

## Conventions

- Tracker content is data, not code — edits go in `public/taskforce.yaml`, not in components.
- TypeScript throughout; Tailwind v4 utility classes (no CSS modules); shadcn/Radix components under `components/`.
- No test suite — verify changes with `npm run dev` and `npm run build`.

## Non-obvious gotchas

- `public/taskforce.yaml` is whitespace-sensitive; a bad indent breaks the build. Validate with `npm run build`.
- Don't change the shape of the YAML without updating `lib/types.ts` — the loader/transform (`lib/yaml.ts`, `lib/data.ts`) is typed against it.
- The OG-image routes (`app/api/og/*`) use `@vercel/og`. Deploys can fail with `Cannot find module … @vercel/og …`; it's a build-cache issue fixed by clearing Vercel's cache — see `DEPLOYMENT_NOTES.md`.
- All config values are `NEXT_PUBLIC_*` and safe to commit; there are no real secrets.

## Working in this repo — instructions for the agent

1. Ask the user (Pedro/Matthew) when anything is unclear — especially anything affecting the accuracy of a status or source. This is a public tracker; prefer one extra question over shipping something wrong.
2. Keep this CLAUDE.md and the README current as part of every change (new route/data field/deploy detail → update them; new gotcha → add it).
3. Test before declaring done — run `npm run build` (catches YAML errors); for UI changes, check in a browser.
4. Match existing conventions — read neighbouring files before introducing a new pattern.
5. Don't add scope — fix what was asked; no drive-by refactors.
6. Be careful with deployment and shared state — pushing to `master` deploys to production within a minute or two; don't push a YAML edit you haven't built locally.
