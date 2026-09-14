# Amara Kato — Video Director Portfolio

A cinematic, editorial portfolio for an independent Nairobi-based video director and visual storyteller.

## Run & Operate

- `pnpm --filter @workspace/video-director-portfolio run dev` — run the portfolio locally
- `pnpm run typecheck` — full typecheck across the portfolio package
- `pnpm --filter @workspace/video-director-portfolio run build` — generate the static Vercel output

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Nuxt 3, Vue 3, Vite
- Build: Nuxt static generation for Vercel

## Where things live

- `artifacts/video-director-portfolio/app.vue` — single-page portfolio experience and interactions
- `artifacts/video-director-portfolio/assets/css/main.css` — portfolio design tokens, layout, typography, motion, and responsive rules
- `artifacts/video-director-portfolio/public/images/` — original local film stills
- `artifacts/video-director-portfolio/nuxt.config.ts` — Nuxt runtime/base-path configuration
- `vercel.json` — static Vercel build and SPA fallback configuration

## Architecture decisions

- The portfolio uses Nuxt static generation so it can be deployed without a server or database.
- The visual system uses a warm paper surface, deep green ink, clay accent, serif display type, and mono metadata to echo film-program/editorial materials.
- Film cards open an accessible detail dialog and use original local stills so the preview does not depend on third-party media hosting.
- The site is configured from `PORT` and `BASE_PATH` for local preview paths and generates `.output/public` for Vercel.

## Product

- Introductory director statement and location
- Selected film work with metadata, hover/play affordance, and detail dialog
- Director statement, services, working approach, recognition, and contact CTA
- Responsive mobile navigation, reveal animations, reduced-motion support, and mailto enquiry links

## User preferences

- The user requested a professional video director portfolio inspired by `scienceandnonduality.com`, built with Vue/Nuxt.

## Gotchas

- The workspace artifact bootstrap started as a React/Vite template, but this artifact was intentionally ported to Nuxt 3/Vue 3 to honor the requested stack. Do not reintroduce the React scaffold when editing the portfolio.
- Keep image references under `/images/` so Nuxt serves the local stills from `public/images/`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
