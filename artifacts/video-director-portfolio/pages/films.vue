<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { films, type Film } from '~/data/films';

const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => `${basePath}${path}`;

const activeTrailer = ref<Film | null>(null);
const activePurchase = ref<Film | null>(null);
const archiveRoot = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const openTrailer = (film: Film) => {
  activeTrailer.value = film;
};

const requestPurchase = (film: Film) => {
  activePurchase.value = film;
};

const closeTrailer = () => {
  activeTrailer.value = null;
};

const closePurchase = () => {
  activePurchase.value = null;
};

const purchaseHref = (film: Film) =>
  `mailto:mageyeglobalworks@gmail.com?subject=${encodeURIComponent(`Film purchase request — ${film.title} — $${film.price}`)}&body=${encodeURIComponent(`Hello Hassan,\n\nI would like to purchase ${film.title} for $${film.price}.\n\nName:\nUse: personal / screening / educational / distribution\n\nThank you.`)}`;

const formatPrice = (price: number) => Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;

const handleWindowKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return;
  if (activeTrailer.value) closeTrailer();
  if (activePurchase.value) closePurchase();
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
          <NuxtLink to="/#coming-soon" class="archive-nav-link font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="link-films-nav-coming-soon">Coming soon</NuxtLink>
          <NuxtLink to="/#awards" class="archive-nav-link font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="link-films-nav-awards">Awards</NuxtLink>
          <NuxtLink to="/#contact" class="archive-nav-link font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="link-films-nav-contact">Contact</NuxtLink>
        </nav>

        <NuxtLink to="/#contact" class="archive-button hidden min-h-[40px] px-4 text-[.82rem] md:inline-flex" data-testid="link-films-contact">Start a conversation</NuxtLink>
      </div>
    </header>

    <main>
      <section class="archive-hero wide-frame" aria-labelledby="archive-heading">
        <div class="archive-hero-media" aria-hidden="true">
          <img :src="asset('/images/devils-chest-hero.png')" alt="" />
        </div>
        <div class="archive-intro reveal">
          <p class="archive-kicker font-mono-ui text-[10px] uppercase tracking-[.2em]">The Mageye film archive</p>
          <h1 id="archive-heading" class="archive-title mt-5 font-display">Films</h1>
          <p class="archive-hero-note mt-5">A collection of films by Hassan Mageye<br class="hidden sm:block" /> exploring African stories, cultural identity,<br class="hidden sm:block" /> and character-driven drama.</p>
          <span class="archive-scroll-arrow mt-6" aria-hidden="true">↓</span>
        </div>
      </section>

      <section class="archive-catalog wide-frame" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" class="sr-only">Film catalogue</h2>
        <div v-if="films.length" class="archive-film-grid">
          <article v-for="(film, index) in films" :key="film.id" class="archive-film-card reveal" :class="`reveal-delay-${(index % 3) + 1}`">
            <div class="archive-film-visual" :style="{ backgroundColor: film.color }">
              <img :src="asset(film.image)" :alt="`${film.title} poster`" class="archive-film-image" loading="lazy" decoding="async" />
              <div class="archive-film-hover-actions film-hover-actions flex flex-wrap items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.1em]">
                <button type="button" class="film-action film-action-watch" @click.stop="requestPurchase(film)">Watch now</button>
                <button type="button" class="film-action film-action-trailer" @click.stop="openTrailer(film)">Trailer</button>
              </div>
            </div>
            <div class="archive-film-copy">
              <NuxtLink :to="`/projects/${film.id}`" class="archive-film-title-link">
                <h3 class="font-display">{{ film.title }}</h3>
              </NuxtLink>
              <p class="archive-film-runtime">{{ film.runtime }}<span v-if="film.year !== '—'"> · {{ film.year }}</span></p>
            </div>
          </article>
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

    <Transition name="trailer-fade">
      <div v-if="activePurchase" class="trailer-modal purchase-modal" role="dialog" aria-modal="true" :aria-label="`Buy ${activePurchase.title}`" @click.self="closePurchase">
        <div class="purchase-modal-card">
          <div class="purchase-modal-header">
            <div class="purchase-modal-heading">
              <span class="purchase-modal-icon" aria-hidden="true">✦</span>
              <div>
                <p class="purchase-modal-title">Purchase</p>
                <p class="purchase-modal-subtitle">Unlock the full movie and request viewing access.</p>
              </div>
            </div>
            <button type="button" class="trailer-close" aria-label="Close purchase panel" @click="closePurchase">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <div class="purchase-modal-body">
            <div class="purchase-modal-left">
              <div class="purchase-film-summary">
                <img :src="asset(activePurchase.image)" :alt="`${activePurchase.title} poster`" class="purchase-film-poster" />
                <div>
                  <p class="purchase-eyebrow">Selected movie</p>
                  <h2 class="purchase-film-title">{{ activePurchase.title }}</h2>
                  <p class="purchase-film-meta">{{ activePurchase.runtime }} · {{ activePurchase.year }}</p>
                </div>
              </div>
            </div>
            <div class="purchase-modal-payment">
              <p class="purchase-eyebrow">Payment</p>
              <strong class="purchase-payment-price">{{ formatPrice(activePurchase.price) }}</strong>
              <div class="purchase-payment-note">
                <span class="purchase-payment-dot" aria-hidden="true"></span>
                <span>Available for checkout</span>
              </div>
              <p class="purchase-payment-copy">Whop checkout can be connected here later. For now, your purchase request opens by email.</p>
              <a :href="purchaseHref(activePurchase)" class="purchase-payment-button">BUY</a>
               <NuxtLink :to="`/watch/${activePurchase.id}`" class="purchase-stream-link">Already purchased? Stream film</NuxtLink>
              <small class="purchase-payment-footnote">By continuing, you agree to the film access terms.</small>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>