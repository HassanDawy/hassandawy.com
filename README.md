# hassandawy.com

The personal site of Hassan Dawy. It looks and works like a laptop desktop:
you open apps in windows, drag them around, and read about the work inside them.

- **Terminal:** `help`, `whoami`, `ls`, `cd`, `pwd`, `cat`, `open`, `resume`,
  `contact`, `skills`, `which`, `clear`. It has history (Up/Down) and Tab completion.
- **Finder:** browse projects, experience, notes and trash as folders and files.
- **Notes:** life updates and writing.
- **Skills:** every skill and method, and the projects and roles that use it.
- **Preview:** shows any Markdown or JSON file, including project READMEs from GitHub.
- **Trash:** projects Hassan stopped, and why.

On screens narrower than 768px, the site shows a simple scrolling page with the
same content instead of the desktop.

## How it works

All content is Markdown and JSON in [`content/`](content). At build time,
[`lib/fs/build-tree.ts`](lib/fs/build-tree.ts) reads it into one virtual
filesystem tree:

```
~/projects/<slug>/about.md
~/projects/<slug>/README.md      fetched from GitHub
~/experience/<slug>.md
~/notes/<date-slug>.md
~/skills/<skill>/<work>          generated from each item's skills and methods
~/.trash/<slug>/WHY_I_STOPPED.md
~/about.json
~/resume.pdf
```

Every app (and the mobile page) reads this same tree, so no content is
hard-coded in components. Windows are managed by a small Zustand store
([`lib/store/windows.ts`](lib/store/windows.ts)). Each app's code loads only
when its window first opens.

Deep links open the desktop with one window already open:

- `/projects/<slug>` opens that project.
- `/notes/<slug>` opens that note.
- `/resume` is a plain page with the PDF, without the desktop.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Zustand, react-rnd, Motion,
gray-matter, and react-markdown with remark-gfm. Tests use Vitest. The site
deploys to Vercel from `main`.

## Run it locally

You need pnpm. The pnpm version is pinned in `package.json` (`packageManager`),
and pnpm downloads the pinned Node version into `node_modules/`, so nothing
else has to be installed globally.

```sh
pnpm install
pnpm dev          # http://localhost:3000
```

Other commands:

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `pnpm build`     | Production build. Run it before each commit.  |
| `pnpm start`     | Serve the production build.                   |
| `pnpm lint`      | ESLint.                                       |
| `pnpm typecheck` | Generate route types, then `tsc --noEmit`.    |
| `pnpm test`      | Vitest unit tests, including content checks.  |

`GITHUB_TOKEN` is optional. If it is set, the README fetch uses it, which
raises the GitHub API rate limit. If a fetch fails, the project shows its
`about.md` and a link to the repo, and the build continues.

## Deploy

Vercel builds every push: `main` goes to production and other branches get a
preview URL. The Vercel project needs the environment variable
`ENABLE_EXPERIMENTAL_COREPACK=1`, so it installs with the pnpm version pinned
in `package.json`. Older pnpm versions reject this repo's `pnpm-workspace.yaml`.

## Edit the content

To publish a note, add a Markdown file and push:

```md
<!-- content/notes/2026-11-02-my-note.md -->
---
title: "My note"
date: 2026-11-02
location: "Boston, MA"   # optional
pinned: false            # optional; one note can be pinned to the top
external: "https://..."  # optional; link to a post published elsewhere
---

The note text, in Markdown.
```

Other content:

- **Projects:** `content/projects/<slug>.md`
- **Experience:** `content/experience/<slug>.md`

  Both use these frontmatter fields: `title`, `summary`, `start` and `end`
  (`"YYYY-MM"`, or `"present"` for `end`), and the lists `skills` and
  `methods`. The optional fields are `featured`, `repo` (`owner/name`, to
  fetch the README), `links`, `collaborators`, `metrics` and `order`.
  Experience items also have `org` and an optional `location`.
- **Trash:** `content/trash/<slug>.md`, with `title`, `summary` and `stopped`.
- **About:** `content/about.json`
- **Skill categories and themes:** `content/skills.json`. Every skill and
  method tag must be in one category.
- **Resume:** `public/resume.pdf`

`pnpm test` checks projects, experience, notes and skill tags against these
rules ([`lib/fs/content.test.ts`](lib/fs/content.test.ts)).

## Project layout

```
app/                  Routes: /, /projects/[slug], /notes/[slug], /resume
components/os/        Desktop, MenuBar, Dock, Window, desktop icons
components/apps/      One folder per app (terminal, finder, notes, skills, viewer)
components/content/   Markdown renderer shared by the apps
components/mobile/    The page shown below 768px
lib/fs/               Virtual filesystem: build, resolve, GitHub READMEs
lib/store/            Window manager
lib/apps/             App registry and what opening a path does
content/              All site content
```
