<script setup lang="ts">
import { computed } from 'vue';
import { films } from '~/data/films';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => `${basePath}${path}`;

const film = computed(() => films.find((item) => item.id === route.params.id));

if (!film.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' });
}

const nextFilm = computed(() => {
  const currentIndex = films.findIndex((item) => item.id === film.value?.id);
  return films[(currentIndex + 1) % films.length];
});

useHead(() => ({
  title: `${film.value?.title ?? 'Project'} — Mageye`,
  meta: [{ name: 'description', content: film.value?.description ?? 'A film project by Hassan Mageye.' }],
}));
</script>

<template>
  <div v-if="film" class="project-page min-h-[100dvh] bg-[var(--paper)] text-[var(--ink)]">
    <header class="project-header wide-frame flex items-center justify-between">
      <NuxtLink to="/" class="group flex items-center gap-3" data-testid="link-project-home">
        <img :src="asset('/images/hassan-mageye.png')" alt="Mageye logo" class="site-logo project-mark" />
        <span class="font-display text-xl tracking-[-.04em]">Mageye</span>
      </NuxtLink>
      <NuxtLink to="/#projects" class="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)] transition-transform hover:translate-x-1" data-testid="link-back-projects">All projects <span aria-hidden="true">↗</span></NuxtLink>
    </header>

    <main>
      <section class="project-intro wide-frame">
        <div class="project-intro-copy">
          <p class="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[var(--coral)]">{{ film.type }} · {{ film.year }}</p>
          <h1 class="mt-6 font-display text-[clamp(4rem,11vw,12rem)] leading-[.78] tracking-[-.09em]">{{ film.title }}</h1>
          <p class="mt-9 max-w-[570px] text-[clamp(1.1rem,1.7vw,1.5rem)] leading-[1.45] text-[var(--ink)]/68">{{ film.description }}</p>
        </div>
        <div class="project-meta border-t border-[var(--line)] pt-4">
          <span class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--ink)]/50">Project details</span>
          <dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
            <div><dt class="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[var(--ink)]/50">Format</dt><dd class="mt-1">{{ film.type }}</dd></div>
            <div><dt class="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[var(--ink)]/50">Runtime</dt><dd class="mt-1">{{ film.runtime }}</dd></div>
            <div><dt class="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[var(--ink)]/50">Release</dt><dd class="mt-1">{{ film.year }}</dd></div>
            <div><dt class="font-mono-ui text-[9px] uppercase tracking-[.12em] text-[var(--ink)]/50">Based in</dt><dd class="mt-1">California, USA</dd></div>
          </dl>
          <a :href="film.imdbUrl" target="_blank" rel="noreferrer" class="soft-button mt-7 inline-flex font-mono-ui text-[10px] uppercase tracking-[.14em]">View on IMDb <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="wide-frame project-hero-image">
        <img :src="asset(film.image)" :alt="`${film.title} film still`" />
      </section>

      <section class="wide-frame project-story">
        <div>
          <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">The story</p>
        </div>
        <div>
          <p class="font-display text-[clamp(2rem,4vw,4.8rem)] leading-[.95] tracking-[-.06em]">{{ film.body }}</p>
          <div class="mt-12 border-t border-[var(--line)] pt-5">
            <p class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--ink)]/50">Credits</p>
            <ul class="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <li v-for="credit in film.credits" :key="credit">{{ credit }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="project-next bg-[var(--ink)] px-6 py-20 text-[var(--paper)] md:py-28">
        <div class="wide-frame flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Next project</p>
            <NuxtLink :to="`/projects/${nextFilm.id}`" class="mt-4 block font-display text-[clamp(2.8rem,6vw,7rem)] leading-[.85] tracking-[-.07em] transition-colors hover:text-[var(--coral)]">{{ nextFilm.title }}</NuxtLink>
          </div>
          <NuxtLink :to="`/projects/${nextFilm.id}`" class="soft-button border-[rgba(241,234,220,.4)] font-mono-ui text-[10px] uppercase tracking-[.14em]" data-testid="link-next-project">Open project <span aria-hidden="true">↗</span></NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>