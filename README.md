# Nuclear Taskforce Tracker

Tracking the progress of government departments, regulators and industry in implementing the UK Nuclear Regulatory Taskforce's recommendations.

A project by the [Centre for British Progress](https://britishprogress.org).

**Live at:** [nuclear.britishprogress.org](https://nuclear.britishprogress.org) · **Repo:** [BritishProgress/nuclear-taskforce-tracker](https://github.com/BritishProgress/nuclear-taskforce-tracker) · **Stack:** a Next.js site on Vercel, with all tracker data in one YAML file · **Maintainers:** Pedro & Matthew.

## Data inventory (for storage planning)

Total on-disk footprint: **~2.0 MB** (the live data is a single committed YAML). **This is a Next.js web app**, deployed publicly, tracking 47 Nuclear Regulatory Taskforce recommendations. No backend database — the data file is loaded at build time.

### Live data — committed to git

| Path | Size | Format | Source / provenance |
| ---- | ---- | ------ | ------------------- |
| `public/taskforce.yaml` | 152 KB, 2850 lines | YAML | **Single source of truth** for the tracker: 47 recommendations × 7 chapters × status updates × sources. Last updated 2025-12-01 in the file header. Maintained by hand against public government announcements and parliamentary statements. **Partly AI-generated** per the README disclaimer. |
| `govt-response-updates.md` | 98 KB | Markdown | Status-update log for the March 2026 DESNZ "Building Our Nuclear Nation" government response. Source for batch updates to `taskforce.yaml`. |

### Committed to git

| Path | Size | Format | Notes |
| ---- | ---- | ------ | ----- |
| `app/`, `components/`, `lib/` (`data.ts`, `yaml.ts`, `timeline-grid.ts`, `export.ts`, `constants.ts`, `types.ts`, `utils.ts`, `date-utils.ts`, `url-utils.ts`) | ~600 KB | TS/TSX | Next.js 16 App Router app code |
| `public/*.svg`, `robots.txt` | 220 KB | SVG + text | Static assets (CBP logos, icons) |
| `package.json`, `package-lock.json` (523 KB), configs | ~535 KB | JSON | npm metadata |
| `PROJECT_PLAN.md` | 25 KB | Markdown | Project plan |
| `DEPLOYMENT_NOTES.md` | 2 KB | Markdown | Deploy notes |
| `LICENSE`, `README.md` | small | — | MIT licence + README |

### Gitignored

`node_modules/`, `.next/`, `.vercel/`, `*.tsbuildinfo`, `.env*`, build artefacts. Standard Next.js exclusions. No persistent application data.

### External

- **Public deployment** (likely Vercel; gitignored `.vercel/` suggests it). The tracker is publicly accessible.
- **Source data:** Nuclear Regulatory Taskforce Report (gov.uk publication), DESNZ "Building Our Nuclear Nation" government response (March 2026), parliamentary statements, departmental announcements. All public.
- **No Drive folder, no database.**

### Refresh cadence

- `public/taskforce.yaml` updates ad hoc when government publishes responses or progress is announced. Last published update: 2025-12-01 (file header); March 2026 update applied via `govt-response-updates.md`.

### Why this matters for storage redesign

- **All "data" is a single committed YAML.** This is the simplest storage model in the entire `work/` tree — no shared-storage implications.
- The interesting question for storage redesign is whether maintaining `taskforce.yaml` manually (currently AI-assisted; see README disclaimer) should become more automated, in which case a structured upstream source (Airtable? `cbp-grid`-style Postgres?) would replace the YAML. That's a *workflow* question, not a *storage* question.

## About

This project tracks the Government's progress in implementing the Nuclear Regulatory Taskforce recommendations. Data is sourced from public government announcements, parliamentary statements, and official publications.

The Centre for British Progress is a non-partisan think tank researching and producing concrete ideas for an era of British growth and progress.

## Features

- Track 47 recommendations across 7 chapters from the UK Nuclear Regulatory Taskforce
- View progress by status: completed, on track, off track, or not started
- Filter and search recommendations
- View by department and ownership
- Timeline of updates and announcements
- Export data to Excel/CSV

## Tech Stack

- [Next.js](https://nextjs.org) 16
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) 4
- [Radix UI](https://www.radix-ui.com) primitives
- [Lucide React](https://lucide.dev) icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Updating the tracker

All tracker content lives in a single file, **`public/taskforce.yaml`** — the 47 recommendations, their statuses, and every dated update. There is no database and no admin interface: updating the tracker means editing that file and pushing, so every change is recorded in the git history.

1. To change a recommendation's status, edit its `overall_status.status` and `overall_status.last_updated`.
2. To add an update, append an entry to that recommendation's `updates` list (`date`, `status`, `title`, `description`, optional `links` and `source_key`).
3. Bump the `last_updated` date at the top of the file.
4. Run `npm run dev` to confirm it loads, then commit and push to `master` — Vercel deploys automatically.

The file is YAML, so watch the indentation. See `CLAUDE.md` for the full data model, and `govt-response-updates.md` for the research notes behind recent changes.

## Keys, secrets & accounts

This site has no secret keys — the only configuration values are public (the Twitter handles, set as `NEXT_PUBLIC_*` variables). The one account that matters is the Vercel project that hosts it.

| Service | What it's for | Account owner | Where it lives | Notes |
|---------|---------------|---------------|----------------|-------|
| Vercel | Hosting + auto-deploy | CBP Vercel team ("Centre for British Progress' projects") | Git-connected; no key | Pushes to `master` deploy automatically. |
| Vercel Analytics | Page analytics | same | enabled in-project | No key needed. |

**When the owner leaves:** make sure Pedro & Matthew (and a CBP admin) have access to the CBP Vercel team so they can see deploys, read build logs, and roll back. There are no third-party keys to rotate.

## When something breaks

- **Build/deploy failed on Vercel** — almost always a YAML mistake in `public/taskforce.yaml` (bad indentation, a stray character). Run `npm run build` locally to see the error, fix the YAML, push again.
- **A recommendation renders wrong or the page errors** — check the most recent `taskforce.yaml` edit; a malformed `updates` entry or an invalid status value is the usual cause.
- **Social preview images fail to build** (`Cannot find module … @vercel/og …`) — a known Vercel build-cache issue; see `DEPLOYMENT_NOTES.md` for the cache-clear fix.
- **Site looks stale after a push** — confirm the Vercel deploy is green, then hard-refresh (Cmd-Shift-R).

## Open questions / known issues

- Recommendation titles and descriptions are partially AI-generated from the Taskforce report (see the disclaimer below) — treat wording as approximate, not verbatim.
- All updates are entered by hand; there is no automated feed from government sources.

## Resources

- [Nuclear Regulatory Taskforce Report](https://www.gov.uk/government/publications/nuclear-regulatory-taskforce) - The original government publication
- [Centre for British Progress](https://britishprogress.org) - Learn more about our work

## Disclaimer

This is an independent project and is not affiliated with HM Government. The content in this tracker is partially AI-generated based on the Nuclear Regulatory Taskforce report. We have worked hard to ensure it is accurate, but some of the titles, descriptions, etc. may be slightly different or truncated.

## License

MIT License - see [LICENSE](LICENSE) for details.

If you use this project, we'd appreciate a mention or link back to the [Centre for British Progress](https://britishprogress.org). It's not required, but it helps us continue building tools for public transparency.
