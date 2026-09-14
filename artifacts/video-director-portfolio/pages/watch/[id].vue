<script setup lang="ts">
import { computed } from 'vue';
import { films } from '~/data/films';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => `${basePath}${path}`;

const film = computed(() => films.find((item) => item.id === route.params.id));

if (!film.value) {
  throw createError({ statusCode: 404, statusMessage: 'Film not found' });
}

useHead(() => ({
  title: `${film.value?.title ?? 'Film'} — Stream — Mageye`,
  meta: [
    {
      name: 'description',
      content: film.value ? `Stream ${film.value.title} by Hassan Mageye.` : 'Stream a film by Hassan Mageye.',
    },
  ],
}));
</script>

<template>
  <div v-if="film" class="stream-page min-h-[100dvh] bg-[var(--ink)] text-[var(--paper)]">
    <header class="stream-header wide-frame flex items-center justify-between">
      <NuxtLink to="/" class="group flex items-center gap-3" data-testid="link-stream-home">
        <img :src="asset('/images/hassan-mageye.png')" alt="Mageye logo" class="site-logo project-mark" />
        <span class="font-display text-xl tracking-[-.04em]">Mageye</span>
      </NuxtLink>
      <NuxtLink to="/films" class="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)] transition-transform hover:translate-x-1" data-testid="link-stream-films">
        All films <span aria-hidden="true">↗</span>
      </NuxtLink>
    </header>

    <main class="stream-main wide-frame">
      <div class="stream-heading">
        <div>
          <p class="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[var(--coral)]">Film stream</p>
          <h1 class="mt-5 font-display text-[clamp(3.4rem,8vw,9rem)] leading-[.82] tracking-[-.08em]">{{ film.title }}</h1>
          <p class="mt-5 font-mono-ui text-[10px] uppercase tracking-[.15em] text-[var(--paper)]/55">{{ film.runtime }} · {{ film.year }}</p>
        </div>
        <NuxtLink :to="`/projects/${film.id}`" class="stream-back-link font-mono-ui text-[10px] uppercase tracking-[.14em]">
          Film details <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>

      <section class="stream-player-shell" :aria-label="`${film.title} video player`">
        <video class="stream-player" controls playsinline preload="metadata" :poster="asset(film.image)">
          <source :src="asset('/video/mageye-trailer.mp4')" type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </section>

      <div class="stream-footer">
        <p class="max-w-[620px] text-sm leading-[1.7] text-[var(--paper)]/65">
          You are viewing {{ film.title }}. This stream is available from the film purchase flow.
        </p>
        <NuxtLink to="/films" class="soft-button stream-library-link font-mono-ui text-[10px] uppercase tracking-[.14em]">
          Back to films <span aria-hidden="true">↗</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>