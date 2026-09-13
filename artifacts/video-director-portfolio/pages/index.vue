<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { films, stories } from '~/data/films';

const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => `${basePath}${path}`;

const navItems = [
  ['Home', '#top'],
  ['Projects', '#projects'],
  ['Story', '#story'],
  ['About', '#about'],
  ['Contact', '#contact'],
] as const;

const approachItems = [
  ['Listen', 'We start with the question underneath the brief.'],
  ['Make space', 'Small crews, generous rooms, time for the unscripted.'],
  ['Shape gently', 'The edit finds the pulse without sanding off the edges.'],
] as const;

const menuOpen = ref(false);
const filmRail = ref<HTMLElement | null>(null);
const revealRoot = ref<HTMLElement | null>(null);
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

onMounted(() => {
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
});

useHead({
  title: 'Mageye — Film Director',
  meta: [
    {
      name: 'description',
      content: 'Hassan Mageye is a Ugandan-American writer, director and producer creating African stories, cultural narratives and character-driven drama.',
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
          <span class="sand-mark">AK</span>
          <span class="font-mono-ui text-[11px] uppercase tracking-[.14em]">Mageye Films</span>
        </a>

        <nav class="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          <a v-for="[label, href] in navItems" :key="href" :href="href" class="font-mono-ui text-[10px] uppercase tracking-[.15em] transition-colors hover:text-[var(--coral)]" :data-testid="`link-nav-${label.toLowerCase()}`">{{ label }}</a>
        </nav>

        <a href="#contact" class="sand-nav-cta soft-button hidden items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] md:flex" data-testid="link-email-header">
          Start a conversation
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M8 5h11v11" /></svg>
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
          <a href="#projects" class="reveal reveal-delay-3 sand-hero-link soft-button mx-auto mt-10 font-mono-ui text-[10px] uppercase tracking-[.16em]">Explore projects <span class="grid h-8 w-8 place-items-center rounded-full border border-white/70">↓</span></a>
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
                <a href="#about" class="soft-button profile-action profile-action-dark font-mono-ui text-[10px] uppercase tracking-[.13em]" data-testid="link-full-profile">Read full profile <span aria-hidden="true">↘</span></a>
                <a href="#projects" class="soft-button profile-action profile-action-outline font-mono-ui text-[10px] uppercase tracking-[.13em]" data-testid="link-profile-projects">Explore projects <span aria-hidden="true">↓</span></a>
                <a href="#contact" class="soft-button profile-action profile-action-accent font-mono-ui text-[10px] uppercase tracking-[.13em]" data-testid="link-profile-contact">Contact Hassan <span aria-hidden="true">↗</span></a>
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
              <h2 id="work-heading" class="mt-5 max-w-[780px] font-display text-[clamp(3rem,6.4vw,7.4rem)] leading-[.86] tracking-[-.07em]">Stories worth returning to.</h2>
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
              <NuxtLink :to="`/projects/${film.id}`" class="group block text-left" :data-testid="`link-project-${film.id}`">
                <div class="film-tile relative overflow-hidden rounded-[8px]" :style="{ backgroundColor: film.color }">
                  <img :src="asset(film.image)" :alt="`${film.title} film still`" class="film-image h-full w-full object-cover" loading="eager" decoding="async" />
                  <div class="film-tile-shade absolute inset-0" />
                  <div class="film-hover-info" aria-hidden="true">
                    <span class="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--coral)]">{{ film.type }}</span>
                    <h3 class="mt-3 font-display text-[clamp(1.7rem,2.8vw,3rem)] leading-[.9] tracking-[-.05em]">{{ film.title }}</h3>
                    <p class="mt-2 text-[11px] text-white/65">{{ film.year }} · {{ film.runtime }}</p>
                    <span class="film-hover-actions mt-5 flex flex-wrap items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.1em]">
                      <span class="film-action film-action-watch">Watch now</span>
                      <span class="film-action film-action-trailer">Trailer</span>
                      <span class="film-action film-action-details">More details</span>
                    </span>
                  </div>
                  <span class="film-tile-type absolute bottom-3 left-3 font-mono-ui text-[9px] uppercase tracking-[.13em] text-white/90">{{ film.type }}</span>
                </div>
                <div class="mt-4 flex items-end justify-between gap-3 pb-5">
                  <div>
                    <h3 class="whitespace-nowrap font-display text-lg tracking-[-.03em]">{{ film.title }}</h3>
                    <p class="mt-1 text-xs text-[var(--paper)]/60">{{ film.year }} · {{ film.runtime }}</p>
                  </div>
                  <span class="font-mono-ui text-[10px] uppercase tracking-[.12em] text-[var(--coral)] transition-transform group-hover:translate-x-1">View ↗</span>
                </div>
              </NuxtLink>
            </article>
            </div>
            <button type="button" class="film-rail-next" aria-label="Show next projects" @click="scrollFilmsForward">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
            </button>
          </div>
          <div class="reveal mt-20 flex flex-col gap-4 border-t border-[rgba(241,234,220,.24)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/50">More stories in the edit</span>
            <a href="mailto:studio@mageye.com?subject=Mageye%20work%20request" class="group inline-flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)]" data-testid="link-request-reel">Request full reel <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><path d="M5 19 19 5M8 5h11v11" /></svg></a>
          </div>
        </div>
      </section>

      <section id="story" class="story-section px-6 py-24 md:py-36" aria-labelledby="story-heading">
        <div class="wide-frame">
          <div class="reveal flex flex-col justify-between gap-7 border-b border-[var(--line)] pb-8 md:flex-row md:items-end">
            <div>
              <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Story / Journal</p>
              <h2 id="story-heading" class="mt-5 font-display text-[clamp(3rem,6.4vw,7rem)] leading-[.86] tracking-[-.07em]">Notes from the<br /><em>in-between.</em></h2>
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

      <section id="about" class="border-y border-[var(--line)] bg-[var(--paper-deep)] px-6 py-24 md:py-36" aria-labelledby="about-heading">
        <div class="wide-frame about-layout">
          <div class="reveal">
            <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">About Hassan</p>
            <p class="mt-10 max-w-[190px] font-mono-ui text-[9px] uppercase leading-[1.7] tracking-[.12em] text-[var(--ink)]/50">On attention / on trust / on the long take</p>
          </div>
          <div class="reveal reveal-delay-1">
            <h2 id="about-heading" class="font-display text-[clamp(2.7rem,5.5vw,6.2rem)] leading-[.9] tracking-[-.065em]">The best work starts with enough room to <em class="text-[var(--coral)]">notice.</em></h2>
            <div class="mt-11 grid gap-8 text-[15px] leading-[1.7] text-[var(--ink)]/70 md:grid-cols-2">
              <p>Hassan's work begins with listening and stays close to the people inside the frame. His stories make room for the in-between: a gesture, a pause, a place carrying more history than it first reveals.</p>
              <p>From California, he works across cultures and continents to make films grounded in African stories, social themes and the emotional detail of character-driven drama.</p>
            </div>
            <a href="#contact" class="soft-button mt-10 bg-[var(--coral)] font-mono-ui text-[10px] uppercase tracking-[.13em] text-[var(--ink)]" data-testid="link-about-contact">Bring me into the room <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section id="approach" class="approach-section px-6 py-24 text-[var(--paper)] md:py-36" aria-labelledby="approach-heading">
        <div class="wide-frame approach-layout">
          <div class="reveal">
            <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">The approach</p>
            <span class="mt-20 hidden h-px w-20 bg-[var(--paper)]/50 md:block" />
          </div>
          <div>
            <h2 id="approach-heading" class="reveal font-display text-[clamp(2.8rem,5vw,6rem)] leading-[.9] tracking-[-.065em]">Slow enough to notice. Precise enough to mean something.</h2>
            <div class="mt-14 grid gap-7 border-t border-[rgba(241,234,220,.4)] pt-6 md:grid-cols-3">
              <div v-for="([title, copy], index) in approachItems" :key="title" class="reveal" :class="`reveal-delay-${index + 1}`"><h3 class="font-display text-2xl italic">{{ title }}</h3><p class="mt-4 text-sm leading-[1.6] text-[var(--paper)]/75">{{ copy }}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="overflow-hidden bg-[var(--ink)] px-6 py-24 text-[var(--paper)] md:py-36" aria-labelledby="contact-heading">
        <div class="wide-frame">
          <div class="reveal flex items-start justify-between"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">The next frame</p><span class="hidden font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/45 md:block">05 — 05</span></div>
          <div class="reveal reveal-delay-1 mt-16 max-w-[1200px]"><h2 id="contact-heading" class="font-display text-[clamp(3.4rem,8.5vw,10rem)] leading-[.84] tracking-[-.08em]">Have a story<br /><em class="text-[var(--coral)]">worth sitting with?</em></h2></div>
          <div class="reveal reveal-delay-2 mt-14 flex flex-col justify-between gap-10 border-t border-[rgba(241,234,220,.25)] pt-6 md:flex-row md:items-end"><p class="max-w-[330px] text-sm leading-[1.65] text-[var(--paper)]/60">Tell Hassan what you are making, what you are trying to say, or what you cannot quite say yet.</p><a href="mailto:studio@mageye.com" class="group inline-flex items-center gap-4 font-display text-[clamp(1.7rem,3.2vw,3.5rem)] italic text-[var(--paper)] transition-colors hover:text-[var(--coral)]" data-testid="link-contact-email">studio@mageye.com <span class="grid h-12 w-12 place-items-center rounded-full border border-[var(--coral)] text-[var(--coral)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg></span></a></div>
          <footer class="mt-24 flex flex-col justify-between gap-5 border-t border-[rgba(241,234,220,.25)] pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--paper)]/45 md:flex-row"><span>© {{ new Date().getFullYear() }} Mageye Studio</span><span>California · USA · Working worldwide</span><a href="#top" class="text-[var(--coral)] hover:underline" data-testid="link-back-to-top">Back to top ↑</a></footer>
        </div>
      </section>
    </main>
  </div>
</template>