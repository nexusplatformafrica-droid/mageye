<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { films, type Film } from '~/data/films';

const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => `${basePath}${path}`;

const filterOptions = ['All films', ...new Set(films.map((film) => film.type.split(' / ')[0]))];
const activeFilter = ref('All films');
const searchQuery = ref('');
const activeTrailer = ref<Film | null>(null);
const archiveRoot = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const featuredFilm = films[0];

const filteredFilms = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return films.filter((film) => {
    const matchesFilter = activeFilter.value === 'All films' || film.type.startsWith(activeFilter.value);
    const matchesQuery = !query || [film.title, film.type, film.description, film.year].join(' ').toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
});

const setFilter = (filter: string) => {
  activeFilter.value = filter;
};

const openTrailer = (film: Film) => {
  activeTrailer.value = film;
};

const requestPurchase = (film: Film) => {
  if (import.meta.client) {
    const detail = { film, handled: false };
    window.dispatchEvent(new CustomEvent('mageye:purchase', { detail }));
    if (detail.handled) return;
  }
  openTrailer(film);
};

const closeTrailer = () => {
  activeTrailer.value = null;
};

const handleWindowKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && activeTrailer.value) closeTrailer();
};

onMounted(() => {
  window.addEventListener('keydown', handleWindowKeydown);
  const revealItems = archiveRoot.value?.querySelectorAll('.reveal');
  if (!revealItems) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((item) => observer?.observe(item));
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener('keydown', handleWindowKeydown);
});

useHead({
  title: 'Films — Mageye',
  meta: [
    {
      name: 'description',
      content: 'The film archive of Hassan Mageye: documentaries, brand films, music stories and editorial portraits.',
    },
  ],
});
</script>

<template>
  <div ref="archiveRoot" class="archive-page min-h-[100dvh] text-[var(--ink)]">
    <header class="archive-header">
      <div class="wide-frame flex h-[74px] items-center justify-between">
        <NuxtLink to="/" class="archive-header-link group flex items-center gap-3" data-testid="link-films-home">
          <img :src="asset('/images/hassan-mageye.png')" alt="Mageye logo" class="site-logo project-mark" />
          <span class="font-display text-xl tracking-[-.04em]">Mageye</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <NuxtLink to="/" class="archive-nav-link font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="link-films-nav-home">Home</NuxtLink>
          <NuxtLink to="/films" class="archive-nav-link font-mono-ui text-[10px] uppercase tracking-[.15em]" aria-current="page" data-testid="link-films-nav-films">Films</NuxtLink>
          <NuxtLink to="/#about" class="archive-nav-link font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="link-films-nav-about">About</NuxtLink>
          <NuxtLink to="/#contact" class="archive-nav-link font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="link-films-nav-contact">Contact</NuxtLink>
        </nav>

        <NuxtLink to="/#contact" class="archive-button hidden min-h-[40px] px-4 text-[.82rem] md:inline-flex" data-testid="link-films-contact">Start a conversation</NuxtLink>
      </div>
    </header>

    <main>
      <section class="archive-hero wide-frame" aria-labelledby="archive-heading">
        <div class="archive-hero-grid">
          <div class="reveal">
            <p class="archive-kicker font-mono-ui text-[10px] uppercase tracking-[.2em]">Films / 01 — 05</p>
            <h1 id="archive-heading" class="archive-title mt-7 font-display">A body of<br /><em>moving work.</em></h1>
          </div>
          <p class="archive-hero-note reveal reveal-delay-1">A considered archive of documentaries, brand films, music stories and portraits made with patience, attention and a little room for the unexpected.</p>
        </div>

        <div class="archive-stats reveal reveal-delay-2">
          <div class="archive-stat">
            <span class="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[var(--ink)]/52">In the archive</span>
            <strong class="archive-stat-value">05 films</strong>
          </div>
          <div class="archive-stat">
            <span class="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[var(--ink)]/52">Across the years</span>
            <strong class="archive-stat-value">2013 — 2025</strong>
          </div>
          <div class="archive-stat">
            <span class="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[var(--ink)]/52">Based in</span>
            <strong class="archive-stat-value">California / USA</strong>
          </div>
        </div>
      </section>

      <section class="wide-frame" aria-labelledby="featured-film-heading">
        <article class="archive-feature reveal">
          <div class="archive-feature-image-wrap">
            <img :src="asset(featuredFilm.image)" :alt="`${featuredFilm.title} film still`" class="archive-feature-image" fetchpriority="high" />
            <span class="archive-feature-index font-mono-ui text-[9px] uppercase tracking-[.15em]">Archive / 01</span>
          </div>
          <div class="archive-feature-copy">
            <div>
              <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Featured film · {{ featuredFilm.type }}</p>
              <h2 id="featured-film-heading" class="mt-6 font-display">{{ featuredFilm.title }}<em>.</em></h2>
              <p class="archive-feature-description mt-7">{{ featuredFilm.description }}</p>
            </div>
            <div>
              <div class="archive-feature-meta font-mono-ui text-[9px] uppercase tracking-[.13em]">
                <span>{{ featuredFilm.year }}</span>
                <span>{{ featuredFilm.runtime }}</span>
                <span>Director — Hassan Mageye</span>
              </div>
              <div class="archive-feature-actions mt-5">
                <button type="button" class="archive-button" data-testid="button-featured-watch" @click="requestPurchase(featuredFilm)">
                  Watch now
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
                </button>
                <NuxtLink :to="`/projects/${featuredFilm.id}`" class="archive-button archive-button-light" data-testid="link-featured-details">Read the project</NuxtLink>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section class="archive-catalog wide-frame" aria-labelledby="catalog-heading">
        <div class="archive-catalog-heading reveal">
          <div>
            <p class="archive-kicker font-mono-ui text-[10px] uppercase tracking-[.18em]">The archive</p>
            <h2 id="catalog-heading" class="mt-5 font-display">Browse the work.</h2>
          </div>
          <span class="archive-catalog-count font-mono-ui text-[9px] uppercase tracking-[.15em]">{{ filteredFilms.length.toString().padStart(2, '0') }} / {{ films.length.toString().padStart(2, '0') }} shown</span>
        </div>

        <div class="archive-toolbar reveal reveal-delay-1">
          <div class="archive-filters" role="group" aria-label="Filter films by format">
            <button
              v-for="filter in filterOptions"
              :key="filter"
              type="button"
              class="archive-filter"
              :class="{ 'is-active': activeFilter === filter }"
              :aria-pressed="activeFilter === filter"
              @click="setFilter(filter)"
            >
              {{ filter }}
            </button>
          </div>
          <label class="archive-search">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.5 4.5" /></svg>
            <span class="sr-only">Search films</span>
            <input v-model="searchQuery" type="search" placeholder="Search the archive" aria-label="Search films" />
          </label>
        </div>

        <div v-if="filteredFilms.length" class="archive-film-grid">
          <article v-for="(film, index) in filteredFilms" :key="film.id" class="archive-film-card reveal" :class="`reveal-delay-${(index % 3) + 1}`">
            <div class="archive-film-visual" :style="{ backgroundColor: film.color }">
              <img :src="asset(film.image)" :alt="`${film.title} film still`" class="archive-film-image" loading="lazy" decoding="async" />
              <span class="archive-film-number font-mono-ui text-[9px] uppercase tracking-[.15em]">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="archive-film-type font-mono-ui text-[9px] uppercase tracking-[.14em]">{{ film.type }}</span>
            </div>
            <div class="archive-film-copy">
              <h3 class="font-display">{{ film.title }}</h3>
              <p class="archive-film-description">{{ film.description }}</p>
              <div class="archive-film-footer">
                <span class="archive-film-meta font-mono-ui text-[9px] uppercase tracking-[.13em]">{{ film.year }} · {{ film.runtime }}</span>
                <div class="archive-film-actions">
                  <button type="button" class="archive-film-action" :data-testid="`button-watch-${film.id}`" @click="requestPurchase(film)">Watch now</button>
                  <NuxtLink :to="`/projects/${film.id}`" class="archive-film-action archive-film-action-secondary" :data-testid="`link-details-${film.id}`">Details</NuxtLink>
                  <a :href="film.imdbUrl" target="_blank" rel="noreferrer" class="archive-film-action archive-film-action-secondary">IMDb</a>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="archive-empty">
          <p class="archive-kicker font-mono-ui text-[10px] uppercase tracking-[.18em]">No frame found</p>
          <p class="mt-4 font-display text-3xl tracking-[-.05em]">Try another title or format.</p>
          <button type="button" class="archive-button archive-button-light mt-6" @click="searchQuery = ''; activeFilter = 'All films'">Clear filters</button>
        </div>
      </section>
    </main>

    <footer class="archive-footer wide-frame flex flex-col justify-between gap-3 font-mono-ui text-[9px] uppercase tracking-[.14em] sm:flex-row">
      <span>© {{ new Date().getFullYear() }} Mageye Studio</span>
      <span>California · USA · Working worldwide</span>
      <NuxtLink to="/" class="text-[var(--coral)] transition-transform hover:translate-x-1">Back to home</NuxtLink>
    </footer>

    <Transition name="trailer-fade">
      <div v-if="activeTrailer" class="trailer-modal" role="dialog" aria-modal="true" :aria-label="`${activeTrailer.title} trailer`" @click.self="closeTrailer">
        <div class="trailer-modal-card">
          <div class="trailer-modal-header">
            <div>
              <p class="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[var(--coral)]">Preview</p>
              <h2 class="mt-2 font-display text-2xl">{{ activeTrailer.title }}</h2>
            </div>
            <button type="button" class="trailer-close" aria-label="Close preview" @click="closeTrailer">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <video class="trailer-video" controls autoplay playsinline :poster="asset(activeTrailer.image)">
            <source :src="asset('/video/mageye-trailer.mp4')" type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>
      </div>
    </Transition>
  </div>
</template>