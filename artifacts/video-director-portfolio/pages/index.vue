<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { films, stories, upcomingProject } from '~/data/films';

const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => `${basePath}${path}`;

const navItems = [
  ['Home', '#top'],
  ['Films', '/films'],
  ['Coming soon', '#coming-soon'],
  ['Awards', '#awards'],
  ['Contact', '#contact'],
] as const;

const awardItems = [
  {
    logo: '/images/awards/uganda-film-festival.svg',
    title: 'Uganda Film Festival',
    result: 'Best Film in an Indigenous Language',
    year: '2025',
  },
  {
    logo: '/images/awards/mashariki-film-festival.svg',
    title: 'Mashariki African Film Festival',
    result: 'Special Mention',
    year: '2025',
  },
  {
    logo: '/images/awards/silicon-valley-film-festival.svg',
    title: 'Silicon Valley African Film Festival',
    result: 'Official selection',
    year: '2025',
  },
  {
    logo: '/images/awards/academy-awards.svg',
    title: 'Academy Awards',
    result: 'Uganda submission · Best International Feature',
    year: '98th edition',
  },
] as const;

const menuOpen = ref(false);
const filmRail = ref<HTMLElement | null>(null);
const revealRoot = ref<HTMLElement | null>(null);
const activeTrailer = ref<(typeof films)[number] | null>(null);
let observer: IntersectionObserver | null = null;

const closeMenu = () => {
  menuOpen.value = false;
};

const scrollFilmsForward = () => {
  filmRail.value?.scrollBy({
    left: filmRail.value.clientWidth * 0.72,
    behavior: 'smooth',
  });
};

const openTrailer = (film: (typeof films)[number]) => {
  activeTrailer.value = film;
};

const requestPurchase = (film: (typeof films)[number]) => {
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
  if (event.key === 'Escape' && activeTrailer.value) {
    closeTrailer();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleWindowKeydown);
  const sections = revealRoot.value?.querySelectorAll('.reveal');
  if (!sections) return;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  sections.forEach((section) => observer?.observe(section));
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener('keydown', handleWindowKeydown);
});

useHead({
  title: 'Mageye — Film Director',
  meta: [
    {
      name: 'description',
      content: 'Hassan Mageye is a Ugandan-American writer, director and producer whose filmmaking career spans more than a decade. His work focuses on African stories, cultural identity, social themes and character-driven drama.',
    },
  ],
  link: films.map((film) => ({
    rel: 'preload',
    as: 'image',
    href: asset(film.image),
  })),
});
</script>

<template>
  <div ref="revealRoot" class="site-shell min-h-[100dvh] bg-[var(--paper)] text-[var(--ink)]">
    <header class="nav-glass sand-nav fixed inset-x-0 top-0 z-40 border-b border-[var(--line)]">
      <div class="wide-frame flex h-[74px] items-center justify-between">
        <a href="#top" @click="closeMenu" class="group flex items-center gap-3" data-testid="link-home">
          <img :src="asset('/images/hassan-mageye.png')" alt="Mageye logo" class="site-logo" />
          <span class="font-display text-xl tracking-[-.04em]">Mageye</span>
        </a>

        <nav class="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          <a v-for="[label, href] in navItems" :key="href" :href="href" class="font-mono-ui text-[10px] uppercase tracking-[.15em] transition-colors hover:text-[var(--coral)]" :data-testid="`link-nav-${label.toLowerCase()}`">{{ label }}</a>
        </nav>

        <a href="#contact" class="sand-nav-cta soft-button hidden items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] md:flex" data-testid="link-email-header">
          Contact
        </a>

        <button type="button" @click="menuOpen = !menuOpen" class="soft-button soft-button-icon md:hidden" :aria-label="menuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="menuOpen" data-testid="button-mobile-menu">
          <svg v-if="menuOpen" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 6 12 12M18 6 6 18" /></svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      <nav v-if="menuOpen" class="border-t border-[var(--line)] bg-[var(--ink)] px-6 py-7 md:hidden" aria-label="Mobile navigation">
        <div class="flex flex-col gap-5">
          <a v-for="[label, href] in navItems" :key="href" :href="href" @click="closeMenu" class="font-display text-3xl text-white" :data-testid="`link-mobile-${label.toLowerCase()}`">{{ label }}</a>
        </div>
      </nav>
    </header>

    <main id="top">
      <section class="hero-slide relative overflow-hidden px-6 pb-14 pt-[124px] md:min-h-[720px] md:px-10 md:pt-[132px]" aria-labelledby="hero-heading">
        <img :src="asset('/images/hero-dawn.jpg')" alt="A cinematic landscape at dawn" class="hero-slide-image" />
        <div class="hero-slide-shade" aria-hidden="true" />
        <div class="relative z-10 mx-auto flex min-h-[540px] max-w-[1600px] flex-col justify-center text-center text-white">
          <p class="reveal font-mono-ui text-[10px] uppercase tracking-[.22em] text-white/80">Writer · director · producer · California / USA</p>
          <h1 id="hero-heading" class="reveal reveal-delay-1 mx-auto mt-7 max-w-[1080px] font-display text-[clamp(3.3rem,8vw,8rem)] leading-[.84] tracking-[-.075em]">Stories with<br /><em>room to breathe.</em></h1>
          <p class="reveal reveal-delay-2 mx-auto mt-9 max-w-[560px] text-[15px] leading-[1.7] text-white/80">Writer, director and producer telling African stories through cultural identity, social themes and character-driven drama.</p>
          <a href="#projects" class="reveal reveal-delay-3 sand-hero-link soft-button mx-auto mt-10 font-mono-ui text-[10px] uppercase tracking-[.16em]">Explore projects</a>
        </div>
        <div class="relative z-10 mx-auto mt-12 flex max-w-[1600px] items-center justify-between border-t border-white/35 pt-4 text-white/75">
          <span class="font-mono-ui text-[9px] uppercase tracking-[.15em]">Scroll to explore</span>
          <span class="font-mono-ui text-[9px] uppercase tracking-[.15em]">01 — 05</span>
        </div>
      </section>

      <section class="profile-strip px-0 py-10 md:py-14" aria-labelledby="profile-heading">
        <div class="wide-frame profile-layout">
          <div class="profile-portrait-wrap">
            <img :src="asset('/images/hassan-mageye.png')" alt="Hassan Mageye, writer, director and producer" class="profile-portrait" />
          </div>
          <div>
            <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Director's profile</p>
            <h2 id="profile-heading" class="mt-5 font-display text-[clamp(2.1rem,4vw,4.8rem)] leading-[.9] tracking-[-.06em]">Hassan Mageye</h2>
            <div class="mt-8 border-t border-[var(--line)] pt-5">
               <p class="max-w-[760px] text-[15px] leading-[1.75] text-[var(--ink)]/72">Hassan Mageye is a Ugandan-American writer, director and producer whose filmmaking career spans more than a decade. He studied Mass Communication at Makerere University and moved from an early interest in journalism toward filmmaking. His work has focused on African stories, cultural identity, social themes and character-driven drama. Hassan Mageye currently resides in California.</p>
              <div class="profile-actions mt-8 flex flex-wrap gap-3">
                <a href="#projects" class="soft-button profile-action profile-action-outline font-mono-ui text-[10px] uppercase tracking-[.13em]" data-testid="link-profile-projects">
                  Explore projects
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>
                </a>
                <a href="#contact" class="soft-button profile-action profile-action-accent font-mono-ui text-[10px] uppercase tracking-[.13em]" data-testid="link-profile-contact">
                  Contact Hassan
                  <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" class="projects-section mt-0 px-0 py-24 text-[var(--paper)] md:py-36" aria-labelledby="work-heading">
        <div class="wide-frame">
          <div class="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Selected projects</p>
              <h2 id="work-heading" class="mt-5 max-w-[780px] font-display text-[clamp(3rem,6.4vw,7.4rem)] leading-[.86] tracking-[-.07em]"><NuxtLink to="/films" class="transition-colors hover:text-[var(--coral)]">FILMS</NuxtLink></h2>
            </div>
            <p class="max-w-[300px] text-sm leading-[1.65] text-[var(--paper)]/60">Documentaries, brand films, portraits and music stories. Each project begins with attention.</p>
          </div>
          <div class="film-rail-shell mt-16">
            <div ref="filmRail" class="film-grid">
            <article
              v-for="(film, index) in films"
              :key="film.id"
              class="film-card reveal"
              :class="index > 2 ? `reveal-delay-${(index % 3) + 1}` : ''"
            >
              <div class="group block text-left">
                <div class="film-tile relative overflow-hidden rounded-[8px]" :style="{ backgroundColor: film.color }">
                   <img :src="asset(film.image)" :alt="`${film.title} poster`" class="film-image h-full w-full object-cover" loading="eager" decoding="async" />
                  <div class="film-tile-shade absolute inset-0" />
                  <div class="film-hover-info">
                    <span class="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--coral)]">{{ film.type }}</span>
                    <h3 class="mt-3 font-display text-[clamp(1.7rem,2.8vw,3rem)] leading-[.9] tracking-[-.05em]">{{ film.title }}</h3>
                    <p class="mt-2 text-[11px] text-white/65">{{ film.year }} · {{ film.runtime }}</p>
                    <span class="film-hover-actions mt-5 flex flex-wrap items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.1em]">
                      <button type="button" class="film-action film-action-watch" @click.stop="requestPurchase(film)">Watch now</button>
                      <button type="button" class="film-action film-action-trailer" @click.stop="openTrailer(film)">Trailer</button>
                      <NuxtLink :to="`/projects/${film.id}`" class="film-action film-action-details">More details</NuxtLink>
                    </span>
                  </div>
                  <span class="film-tile-type absolute bottom-3 left-3 font-mono-ui text-[9px] uppercase tracking-[.13em] text-white/90">{{ film.type }}</span>
                </div>
                <div class="mt-4 flex items-end justify-between gap-3 pb-5">
                  <div>
                    <h3 class="whitespace-nowrap font-display text-lg tracking-[-.03em]">{{ film.title }}</h3>
                    <p class="mt-1 text-xs text-[var(--paper)]/60">{{ film.year }} · {{ film.runtime }}</p>
                  </div>
                  <NuxtLink :to="`/projects/${film.id}`" class="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[var(--coral)] transition-transform group-hover:translate-x-1">View ↗</NuxtLink>
                </div>
              </div>
            </article>
            </div>
            <button type="button" class="film-rail-next" aria-label="Show next projects" @click="scrollFilmsForward">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
            </button>
          </div>
          <div class="reveal mt-20 flex flex-col gap-4 border-t border-[rgba(241,234,220,.24)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/50">More stories in the edit</span>
             <a href="mailto:mageyeglobalworks@gmail.com?subject=Mageye%20work%20request" class="group inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)]" data-testid="link-request-reel">Request full reel <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><path d="M5 19 19 5M8 5h11v11" /></svg></a>
          </div>
        </div>
      </section>

      <section id="story" class="story-section px-0 py-24 md:py-36" aria-labelledby="story-heading">
        <div class="wide-frame">
          <div class="reveal flex flex-col justify-between gap-7 border-b border-[var(--line)] pb-8 md:flex-row md:items-end">
            <div>
              <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Events</p>
              <h2 id="story-heading" class="mt-5 font-display text-[clamp(3rem,6.4vw,7rem)] leading-[.86] tracking-[-.07em]">EVENTS</h2>
            </div>
            <p class="max-w-[330px] text-sm leading-[1.65] text-[var(--ink)]/60">Field notes, working practices and small observations from the road.</p>
          </div>
          <div class="story-grid mt-12">
            <article v-for="(story, index) in stories" :key="story.id" class="story-card reveal" :class="`reveal-delay-${index + 1}`">
              <a href="#contact" class="group block" :data-testid="`link-story-${story.id}`">
                <div class="story-image-wrap relative aspect-[1.6] overflow-hidden rounded-[8px]">
                  <img :src="asset(story.image)" :alt="story.title" class="story-image h-full w-full object-cover" />
                  <div class="story-card-overlay absolute inset-0 flex flex-col justify-end p-4 text-white md:p-5">
                    <div class="flex items-center justify-between gap-3 font-mono-ui text-[8px] uppercase tracking-[.12em] text-white/65">
                      <span class="text-[var(--coral)]">{{ story.category }}</span>
                      <span>{{ story.date }} · {{ story.readTime }}</span>
                    </div>
                    <h3 class="mt-3 font-display text-[clamp(1.25rem,1.65vw,2rem)] leading-[.95] tracking-[-.045em]">{{ story.title }}</h3>
                    <p class="mt-3 text-xs leading-[1.5] text-white/70">{{ story.excerpt }}</p>
                  </div>
                </div>
                <span class="mt-4 inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)]">Continue reading <span class="transition-transform group-hover:translate-x-1">→</span></span>
              </a>
            </article>
          </div>
        </div>
      </section>

      <section
        id="coming-soon"
        class="coming-soon-section relative overflow-hidden border-y border-[var(--line)] px-6 py-16 text-white md:py-20"
        :style="{ backgroundImage: `url(${asset('/images/silence-we-flee.jpg')})` }"
        aria-labelledby="coming-soon-heading"
      >
        <div class="coming-soon-overlay" aria-hidden="true" />
        <div class="coming-soon-inner relative z-[1]">
          <div class="coming-soon-heading reveal">
            <p class="coming-soon-kicker font-display">Coming soon</p>
          </div>
          <div class="coming-soon-layout">
            <figure class="coming-soon-portrait reveal reveal-delay-1">
              <div class="coming-soon-portrait-frame">
                <div class="coming-soon-portrait-glow" aria-hidden="true" />
                <img
                  :src="asset('/images/hassan-mageye-coming-soon.avif')"
                  alt="Hassan Mageye"
                  class="coming-soon-portrait-image"
                />
              </div>
              <figcaption class="coming-soon-portrait-caption mt-5 font-mono-ui text-[9px] uppercase leading-[1.7] tracking-[.12em] text-white/70">
                Written and directed by Hassan Mageye
              </figcaption>
            </figure>
            <div class="coming-soon-copy reveal reveal-delay-2">
              <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">{{ upcomingProject.type }}</p>
              <h2 id="coming-soon-heading" class="mt-5 font-display text-[clamp(2.4rem,4.4vw,4.8rem)] leading-[.9] tracking-[-.065em]">{{ upcomingProject.title }}</h2>
              <p class="mt-8 max-w-[760px] text-[15px] leading-[1.75] text-white/80">{{ upcomingProject.description }}</p>
              <div class="coming-soon-actions mt-8 flex">
                <a
                  href="https://www.thesilencewefleemovie.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="soft-button w-fit"
                  data-testid="link-silence-we-flee-more"
                >
                  More about the film
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                    <path d="M5 12h13" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="awards" class="awards-section border-y border-[var(--line)] bg-[var(--paper-deep)] px-6 py-16 md:py-20" aria-labelledby="awards-heading">
        <div class="awards-inner">
          <div class="awards-heading reveal">
            <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Selected recognition · Kimote · 2025</p>
            <h2 id="awards-heading" class="mt-4 font-display text-[clamp(2.7rem,5.5vw,5.8rem)] leading-[.82] tracking-[-.075em]">Winning <em class="text-[var(--coral)]">&amp; awards.</em></h2>
          </div>
          <div class="awards-grid mt-10">
            <article v-for="(award, index) in awardItems" :key="award.title" class="award-card reveal" :class="`reveal-delay-${index + 1}`">
              <img :src="asset(award.logo)" :alt="`${award.result} — ${award.title}`" class="award-logo" />
              <p class="award-result mt-3 font-mono-ui text-[9px] uppercase leading-[1.45] tracking-[.12em]">{{ award.result }}</p>
              <h3 class="mt-2 font-display text-[clamp(1.05rem,1.5vw,1.45rem)] leading-[.95] tracking-[-.045em]">{{ award.title }}</h3>
              <p class="mt-4 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--ink)]/48">{{ award.year }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" class="overflow-hidden bg-[var(--ink)] px-6 py-24 text-[var(--paper)] md:py-36" aria-labelledby="contact-heading">
        <div class="wide-frame">
           <div class="reveal flex items-start justify-between"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Contact</p><span class="hidden font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/45 md:block">Hassan Mageye</span></div>
           <div class="reveal reveal-delay-1 mt-16 max-w-[1200px]"><h2 id="contact-heading" class="font-display text-[clamp(3.4rem,8.5vw,10rem)] leading-[.84] tracking-[-.08em]">HASSAN<br /><em class="text-[var(--coral)]">MAGEYE</em></h2></div>
           <div class="reveal reveal-delay-2 mt-14 flex flex-col justify-between gap-10 border-t border-[rgba(241,234,220,.25)] pt-6 md:flex-row md:items-end"><div class="max-w-[520px]"><p class="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[var(--coral)]">Hassan Mageye</p><p class="mt-3 text-sm leading-[1.65] text-[var(--paper)]/60">Writer · Director · Producer</p><p class="mt-3 text-sm leading-[1.65] text-[var(--paper)]/60">For film screenings, distribution, press, partnerships, and production inquiries.</p><p class="mt-3 text-sm leading-[1.65] text-[var(--paper)]/60">Instagram · TikTok · X</p></div><a href="mailto:mageyeglobalworks@gmail.com" class="group inline-flex items-center gap-4 font-display text-[clamp(1.35rem,3.2vw,3.5rem)] italic text-[var(--paper)] transition-colors hover:text-[var(--coral)]" data-testid="link-contact-email">mageyeglobalworks@gmail.com <span class="grid h-12 w-12 place-items-center rounded-full border border-[var(--coral)] text-[var(--coral)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6-8 6" /></svg></span></a></div>
          <footer class="mt-24 flex flex-col justify-between gap-5 border-t border-[rgba(241,234,220,.25)] pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--paper)]/45 md:flex-row"><span>© {{ new Date().getFullYear() }} Mageye Studio</span><span>California · USA · Working worldwide</span><a href="#top" class="text-[var(--coral)] hover:underline" data-testid="link-back-to-top">Back to top ↑</a></footer>
        </div>
      </section>
    </main>

    <Transition name="trailer-fade">
      <div v-if="activeTrailer" class="trailer-modal" role="dialog" aria-modal="true" :aria-label="`${activeTrailer.title} trailer`" @click.self="closeTrailer">
        <div class="trailer-modal-card">
          <div class="trailer-modal-header">
            <div>
              <p class="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[var(--coral)]">Trailer</p>
              <h2 class="mt-2 font-display text-2xl">{{ activeTrailer.title }}</h2>
            </div>
            <button type="button" class="trailer-close" aria-label="Close trailer player" @click="closeTrailer">
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