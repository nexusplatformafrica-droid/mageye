---
name: Nuxt artifact runtime
description: Why the portfolio app uses Nuxt inside the workspace artifact workflow
---

The portfolio uses Nuxt 3 and Vue 3 even though the workspace web-artifact bootstrap is React/Vite-oriented.

**Why:** The user explicitly requested Vue/Nuxt, so preserving the artifact workflow while replacing the frontend runtime was the best way to keep the app previewable and publishable without changing the workspace routing model.

**How to apply:** Keep the managed web workflow and its `PORT`/`BASE_PATH` contract when extending this artifact. Treat the Nuxt app as the frontend source of truth, not the original React scaffold.