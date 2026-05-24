# Nuclear Taskforce Tracker

Tracking the progress of government departments, regulators and industry in implementing the UK Nuclear Regulatory Taskforce's recommendations.

A project by the [Centre for British Progress](https://britishprogress.org).

**Live at:** [nuclear.britishprogress.org](https://nuclear.britishprogress.org) · **Repo:** [BritishProgress/nuclear-taskforce-tracker](https://github.com/BritishProgress/nuclear-taskforce-tracker) · **Stack:** a Next.js site on Vercel, with all tracker data in one YAML file · **Maintainers:** Pedro & Matthew.

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
