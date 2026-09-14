---
name: Nuxt artifact runtime
description: Why the portfolio app uses Nuxt inside the workspace artifact workflow
---

The portfolio uses Nuxt 3 and Vue 3 even though the workspace web-artifact bootstrap is React/Vite-oriented.

**Why:** The user explicitly requested Vue/Nuxt, so preserving the artifact workflow while replacing the frontend runtime was the best way to keep the app previewable and publishable without changing the workspace routing model.

**How to apply:** Keep the managed web workflow and its `PORT`/`BASE_PATH` contract when extending this artifact. Treat the Nuxt app as the frontend source of truth, not the original React scaffold.

For Vercel, the portfolio must use Nuxt static generation and publish `.output/public`; do not point Vercel at the old copied `dist/public` directory or use the Node server preset.

**Why:** Vercel's output inspection failed when the deployment was configured around the old directory and expected a server entrypoint. Static generation produces `index.html` and assets with no runtime server.

**How to apply:** Keep the frontend-only build command as `nuxt generate`, use `.output/public` as the Vercel output directory, and keep admin edits browser-local unless shared publishing is explicitly requested.