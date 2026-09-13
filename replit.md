# Amara Kato — Video Director Portfolio

A cinematic, editorial portfolio for an independent Nairobi-based video director and visual storyteller.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Nuxt 3, Vue 3, Vite
- API: Express 5 (shared workspace service)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: Nuxt/Nitro for the portfolio, esbuild (CJS bundle) for the API

## Where things live

- `artifacts/video-director-portfolio/app.vue` — single-page portfolio experience and interactions
- `artifacts/video-director-portfolio/assets/css/main.css` — portfolio design tokens, layout, typography, motion, and responsive rules
- `artifacts/video-director-portfolio/public/images/` — original local film stills
- `artifacts/video-director-portfolio/nuxt.config.ts` — Nuxt runtime/base-path configuration
- `artifacts/api-server/` — shared API service scaffold; not currently required by the portfolio

## Architecture decisions

- The portfolio is intentionally a single Nuxt page so the visual narrative can flow without route transitions or a CMS dependency.
- The visual system uses a warm paper surface, deep green ink, clay accent, serif display type, and mono metadata to echo film-program/editorial materials.
- Film cards open an accessible detail dialog and use original local stills so the preview does not depend on third-party media hosting.
- The site is configured from `PORT` and `BASE_PATH` so it works with the artifact workflow and proxied preview path.

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
