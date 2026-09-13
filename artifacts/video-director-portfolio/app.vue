<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Film = {
  id: string;
  title: string;
  type: string;
  year: string;
  runtime: string;
  image: string;
  color: string;
  description: string;
};

const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => `${basePath}${path}`;

const films: Film[] = [
  {
    id: 'tide-lines',
    title: 'Tide Lines',
    type: 'Documentary short',
    year: '2024',
    runtime: '12 min',
    image: asset('/images/film-tide.jpg'),
    color: '#d7bfa2',
    description: 'A quiet portrait of the people who read the lake before the weather arrives.',
  },
  {
    id: 'earth-speaks',
    title: 'Earth Speaks',
    type: 'Brand film / Kijani',
    year: '2023',
    runtime: '02:14',
    image: asset('/images/film-earth.jpg'),
    color: '#b7bd91',
    description: 'A study in hands, heat and the slow patience of making something last.',
  },
  {
    id: 'blue-hour',
    title: 'Blue Hour',
    type: 'Documentary short',
    year: '2023',
    runtime: '08 min',
    image: asset('/images/film-coast.jpg'),
    color: '#7e8e91',
    description: 'A coastal portrait about memory, salt air and the people who stay with the tide.',
  },
  {
    id: 'in-the-making',
    title: 'In the Making',
    type: 'Brand film / Kijani',
    year: '2023',
    runtime: '03:40',
    image: asset('/images/film-clay.jpg'),
    color: '#bd8b60',
    description: 'A tactile study of craft, patience and the hands that keep a material alive.',
  },
  {
    id: 'after-the-rain',
    title: 'After the Rain',
    type: 'Music film',
    year: '2022',
    runtime: '04:16',
    image: asset('/images/film-song.jpg'),
    color: '#596d65',
    description: 'A moving portrait of rhythm, friendship and the first song after a storm.',
  },
  {
    id: 'the-weavers',
    title: 'The Weavers',
    type: 'Editorial portrait',
    year: '2021',
    runtime: '10 min',
    image: asset('/images/film-weave.jpg'),
    color: '#9b7654',
    description: 'A quiet look at the patterns passed between generations by hand.',
  },
];

const navItems = [
  ['Home', '#top'],
  ['About', '#about'],
  ['Programs', '#programs'],
  ['Projects', '#projects'],
  ['Gallery', '#gallery'],
  ['Contact', '#contact'],
] as const;

const menuOpen = ref(false);
const selectedFilm = ref<Film | null>(null);
const cursorX = ref(0);
const cursorY = ref(0);
const cursorActive = ref(false);
const revealRoot = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const closeMenu = () => {
  menuOpen.value = false;
};

const handleFilmMouseMove = (event: MouseEvent) => {
  cursorX.value = event.clientX;
  cursorY.value = event.clientY;
  cursorActive.value = true;
};

const hideCursor = () => {
  cursorActive.value = false;
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
  title: 'Amara Kato — Film Director',
  meta: [
    {
      name: 'description',
      content: 'Amara Kato is a Nairobi-based film director making intimate human documentaries and atmospheric brand films.',
    },
  ],
});
</script>

<template>
  <div ref="revealRoot" class="min-h-[100dvh] bg-[var(--paper)] text-[var(--ink)]">
    <div
      class="cursor-play hidden md:grid"
      :class="{ 'is-active': cursorActive }"
      :style="{ left: `${cursorX}px`, top: `${cursorY}px` }"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="m9 6 8 6-8 6V6Z" /></svg>
    </div>

    <header class="nav-glass sand-nav fixed inset-x-0 top-0 z-40 border-b border-[var(--line)]">
      <div class="mx-auto flex h-[74px] max-w-[1380px] items-center justify-between px-6 md:px-10">
        <a href="#top" @click="closeMenu" class="group flex items-center gap-3" data-testid="link-home">
          <span class="sand-mark">AK</span>
          <span class="font-mono-ui text-[11px] uppercase tracking-[.14em]">Amara Kato Films</span>
        </a>

        <nav class="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          <a v-for="[label, href] in navItems" :key="href" :href="href" class="font-mono-ui text-[10px] uppercase tracking-[.15em] transition-colors hover:text-[var(--coral)]" :data-testid="`link-nav-${label.toLowerCase()}`">{{ label }}</a>
        </nav>

        <a href="#contact" class="sand-nav-cta hidden items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] md:flex" data-testid="link-email-header">
          Join the reel
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M8 5h11v11" /></svg>
        </a>

        <button type="button" @click="menuOpen = !menuOpen" class="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] md:hidden" :aria-label="menuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="menuOpen" data-testid="button-mobile-menu">
          <svg v-if="menuOpen" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 6 12 12M18 6 6 18" /></svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      <nav v-if="menuOpen" class="border-t border-[var(--line)] bg-[var(--paper)] px-6 py-7 md:hidden" aria-label="Mobile navigation">
        <div class="flex flex-col gap-5">
          <a v-for="[label, href] in navItems" :key="href" :href="href" @click="closeMenu" class="font-display text-3xl italic" :data-testid="`link-mobile-${label.toLowerCase()}`">{{ label }}</a>
        </div>
      </nav>
    </header>

    <main id="top">
      <section class="sand-hero relative min-h-[800px] overflow-hidden px-6 pb-14 pt-[145px] md:min-h-[860px] md:px-10 md:pt-[174px]" aria-labelledby="hero-heading">
        <img :src="asset('/images/hero-dawn.jpg')" alt="A woman standing among tall grass at dawn in the Ngong Hills" class="sand-hero-image" />
        <div class="sand-hero-shade" aria-hidden="true" />
        <div class="relative z-10 mx-auto flex min-h-[650px] max-w-[1380px] flex-col justify-center text-center text-white">
          <p class="reveal font-mono-ui text-[10px] uppercase tracking-[.22em] text-white/80">Independent director · Nairobi / East Africa</p>
          <h1 id="hero-heading" class="reveal reveal-delay-1 mx-auto mt-7 max-w-[1120px] font-display text-[clamp(3.8rem,10vw,9.2rem)] leading-[.88] tracking-[-.065em]">Stories with<br /><em>room to breathe.</em></h1>
          <p class="reveal reveal-delay-2 mx-auto mt-9 max-w-[520px] text-[15px] leading-[1.65] text-white/80">Amara Kato is a film director and visual storyteller making intimate documentaries and atmospheric brand films about the people, places and quiet forces shaping our future.</p>
          <a href="#projects" class="reveal reveal-delay-3 sand-hero-link mx-auto mt-10 inline-flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.16em]">Explore projects <span class="grid h-10 w-10 place-items-center rounded-full border border-white/70">↓</span></a>
        </div>
        <div class="relative z-10 mx-auto mt-12 flex max-w-[1380px] items-center justify-between border-t border-white/35 pt-4 text-white/75">
          <span class="font-mono-ui text-[9px] uppercase tracking-[.15em]">Scroll to explore</span>
          <span class="font-mono-ui text-[9px] uppercase tracking-[.15em]">01 — 07</span>
        </div>
      </section>

      <section id="projects" class="projects-section bg-[var(--ink)] px-6 py-24 text-[var(--paper)] md:px-10 md:py-36" aria-labelledby="work-heading">
        <div class="mx-auto max-w-[1380px]">
          <div class="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Projects · Films</p>
              <h2 id="work-heading" class="mt-5 max-w-[700px] font-display text-[clamp(3rem,6.4vw,6.7rem)] leading-[.92] tracking-[-.06em]">Stories worth returning to.</h2>
            </div>
            <p class="max-w-[270px] text-sm leading-[1.65] text-[var(--paper)]/60">A library of documentaries, brand films, portraits and music stories. Press play on a world.</p>
          </div>
          <div class="film-grid mt-16">
            <article v-for="(film, index) in films" :key="film.id" class="film-card reveal" :class="index > 2 ? `reveal-delay-${(index % 3) + 1}` : ''">
              <button type="button" class="group block w-full text-left" @click="selectedFilm = film" @mousemove="handleFilmMouseMove" @mouseleave="hideCursor" @focus="hideCursor" :data-testid="`button-play-${film.id}`">
                <div class="film-tile relative overflow-hidden rounded-[8px]" :style="{ backgroundColor: film.color }">
                  <img :src="film.image" :alt="`${film.title} film still`" class="film-image aspect-video w-full object-cover" />
                  <div class="film-tile-shade absolute inset-0" />
                  <span class="film-play absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="m9 6 8 6-8 6V6Z" /></svg>
                  </span>
                  <span class="absolute bottom-3 left-3 font-mono-ui text-[9px] uppercase tracking-[.13em] text-white/90">{{ film.type }}</span>
                </div>
                <div class="mt-4 flex flex-col gap-2 border-b border-[rgba(241,234,220,.24)] pb-5">
                  <div>
                    <h3 class="font-display text-2xl tracking-[-.03em]">{{ film.title }}</h3>
                    <p class="mt-1 text-xs text-[var(--paper)]/60">{{ film.year }} · {{ film.runtime }}</p>
                  </div>
                </div>
              </button>
            </article>
          </div>
          <div class="reveal mt-20 flex items-center justify-between border-t border-[rgba(241,234,220,.24)] pt-5">
            <span class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/50">More stories in the edit</span>
            <a href="mailto:studio@amarakato.com?subject=Amara%20Kato%20work%20request" class="group flex items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)]" data-testid="link-request-reel">
              Request full reel
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><path d="M5 19 19 5M8 5h11v11" /></svg>
            </a>
          </div>
        </div>
      </section>

      <section id="about" class="px-6 py-24 md:px-10 md:py-40" aria-labelledby="about-heading">
        <div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6">
          <div class="reveal md:col-span-3">
            <p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">A director's note</p>
            <p class="mt-10 max-w-[170px] font-mono-ui text-[9px] uppercase leading-[1.7] tracking-[.12em] text-[var(--ink)]/50">On attention / on trust / on the long take</p>
          </div>
          <div class="reveal reveal-delay-1 md:col-span-8 md:col-start-5">
            <h2 id="about-heading" class="font-display text-[clamp(2.7rem,5.5vw,5.8rem)] leading-[.98] tracking-[-.055em]">I make films for the moment <em class="text-[var(--coral)]">before</em> someone realises the camera is there.</h2>
            <div class="mt-11 grid gap-8 text-[15px] leading-[1.7] text-[var(--ink)]/70 md:grid-cols-2"><p>My work begins with listening. I am interested in the in-between: a hand hovering over a workbench, a laugh that arrives late, the particular hush of a place just before it wakes.</p><p>From Nairobi, I work across East Africa and wherever a good story asks me to go. The aim is simple: make something honest enough to keep looking at.</p></div>
            <a href="#contact" class="mt-10 inline-flex items-center gap-2 border-b border-[var(--coral)] pb-2 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[var(--coral)]" data-testid="link-about-contact">Bring me into the room <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M8 5h11v11" /></svg></a>
          </div>
        </div>
      </section>

      <section id="programs" class="border-y border-[var(--line)] bg-[var(--paper-deep)] px-6 py-20 md:px-10 md:py-28" aria-labelledby="services-heading">
        <div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6">
          <div class="reveal md:col-span-4"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">Ways of working</p><h2 id="services-heading" class="mt-5 font-display text-4xl leading-none tracking-[-.04em]">The right size<br /><em>for the story.</em></h2></div>
          <div class="md:col-span-7 md:col-start-6">
            <div v-for="([number, title, description], index) in [['01', 'Documentary & editorial', 'Short films, profiles and observational work with a human centre.'], ['02', 'Atmospheric brand film', 'Visual worlds that earn attention slowly, then stay with you.'], ['03', 'Creative direction', 'A considered visual language from first question to final frame.']]" :key="number" class="flex gap-5 border-t border-[var(--line)] py-7 md:gap-9" :class="`reveal reveal-delay-${index + 1}`">
              <span class="font-mono-ui text-[10px] text-[var(--coral)]">{{ number }}</span>
              <div class="flex-1 md:flex md:items-start md:justify-between md:gap-8"><h3 class="font-display text-2xl">{{ title }}</h3><p class="mt-3 max-w-[245px] text-sm leading-[1.6] text-[var(--ink)]/60 md:mt-0">{{ description }}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" class="bg-[var(--coral)] px-6 py-24 text-[var(--paper)] md:px-10 md:py-36" aria-labelledby="approach-heading">
        <div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6">
          <div class="reveal md:col-span-4"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--paper)]/70">The approach</p><span class="mt-20 hidden h-px w-20 bg-[var(--paper)]/50 md:block" /></div>
          <div class="md:col-span-7 md:col-start-6">
            <h2 id="approach-heading" class="reveal font-display text-[clamp(2.8rem,5vw,5.5rem)] leading-[.95] tracking-[-.055em]">Slow enough to notice. Precise enough to mean something.</h2>
            <div class="mt-14 grid gap-7 border-t border-[rgba(241,234,220,.4)] pt-6 md:grid-cols-3">
              <div v-for="([title, copy], index) in [['Listen', 'We start with the question underneath the brief.'], ['Make space', 'Small crews, generous rooms, time for the unscripted.'], ['Shape gently', 'The edit finds the pulse without sanding off the edges.']]" :key="title" class="reveal" :class="`reveal-delay-${index + 1}`"><h3 class="font-display text-2xl italic">{{ title }}</h3><p class="mt-4 text-sm leading-[1.6] text-[var(--paper)]/75">{{ copy }}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" class="gallery-section px-6 py-24 md:px-10 md:py-36" aria-labelledby="recognition-heading">
        <div class="mx-auto grid max-w-[1380px] gap-14 md:grid-cols-12 md:gap-6">
          <div class="reveal md:col-span-3"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">A few good words</p></div>
          <div class="md:col-span-8 md:col-start-5">
            <blockquote class="reveal"><p id="recognition-heading" class="font-display text-[clamp(2.7rem,5.3vw,5.6rem)] leading-[.98] tracking-[-.055em]">“Amara finds the poetry in the practical. She made our story feel less like a campaign and more like a memory we had forgotten to keep.”</p><footer class="mt-9 flex items-center gap-4 font-mono-ui text-[10px] uppercase tracking-[.13em] text-[var(--ink)]/55"><span class="h-px w-8 bg-[var(--coral)]" /> Nia Wambui · Kijani Studio</footer></blockquote>
            <div class="reveal reveal-delay-1 mt-20 grid gap-7 border-t border-[var(--line)] pt-6 md:grid-cols-2"><div><p class="font-mono-ui text-[9px] uppercase tracking-[.13em] text-[var(--ink)]/50">Recognition</p><p class="mt-3 font-display text-2xl">Official selection<br /><em>Kalasha Film Festival</em></p></div><div><p class="font-mono-ui text-[9px] uppercase tracking-[.13em] text-[var(--ink)]/50">Based in</p><p class="mt-3 font-display text-2xl">Nairobi, Kenya<br /><em>Working everywhere</em></p></div></div>
            <div class="gallery-grid reveal reveal-delay-2 mt-20">
              <figure v-for="image in ['/images/hero-dawn.jpg', '/images/film-clay.jpg', '/images/film-weave.jpg']" :key="image" class="gallery-frame overflow-hidden rounded-[8px]">
                <img :src="asset(image)" alt="Amara Kato film still" class="film-image aspect-[1.1] w-full object-cover" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="overflow-hidden bg-[var(--ink)] px-6 py-24 text-[var(--paper)] md:px-10 md:py-36" aria-labelledby="contact-heading">
        <div class="mx-auto max-w-[1380px]">
          <div class="reveal flex items-start justify-between"><p class="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[var(--coral)]">The next frame</p><span class="hidden font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--paper)]/45 md:block">07 — 07</span></div>
          <div class="reveal reveal-delay-1 mt-16 max-w-[1060px]"><h2 id="contact-heading" class="font-display text-[clamp(3.4rem,8.5vw,8.7rem)] leading-[.87] tracking-[-.07em]">Have a story<br /><em class="text-[var(--coral)]">worth sitting with?</em></h2></div>
          <div class="reveal reveal-delay-2 mt-14 flex flex-col justify-between gap-10 border-t border-[rgba(241,234,220,.25)] pt-6 md:flex-row md:items-end"><p class="max-w-[310px] text-sm leading-[1.65] text-[var(--paper)]/60">Tell me what you are making, what you are trying to say, or what you cannot quite say yet.</p><a href="mailto:studio@amarakato.com" class="group inline-flex items-center gap-4 font-display text-3xl italic text-[var(--paper)] transition-colors hover:text-[var(--coral)]" data-testid="link-contact-email">studio@amarakato.com <span class="grid h-12 w-12 place-items-center rounded-full border border-[var(--coral)] text-[var(--coral)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg></span></a></div>
          <footer class="mt-24 flex flex-col justify-between gap-5 border-t border-[rgba(241,234,220,.25)] pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--paper)]/45 md:flex-row"><span>© {{ new Date().getFullYear() }} Amara Kato Studio</span><span>Nairobi · Kenya · East Africa</span><a href="#top" class="text-[var(--coral)] hover:underline" data-testid="link-back-to-top">Back to top ↑</a></footer>
        </div>
      </section>
    </main>

    <div v-if="selectedFilm" class="fixed inset-0 z-50 grid place-items-center bg-[rgba(25,61,58,.88)] p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="film-dialog-title">
      <div class="relative w-full max-w-3xl overflow-hidden rounded-[26px] bg-[var(--paper)] text-[var(--ink)] shadow-2xl">
        <button type="button" @click="selectedFilm = null" class="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[var(--paper)]/90" aria-label="Close film details" data-testid="button-close-film"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        <img :src="selectedFilm.image" :alt="`${selectedFilm.title} preview`" class="aspect-[1.9] w-full object-cover" />
        <div class="flex flex-col gap-5 p-7 md:flex-row md:items-end md:justify-between md:p-9"><div><p class="font-mono-ui text-[9px] uppercase tracking-[.15em] text-[var(--coral)]">{{ selectedFilm.type }} · {{ selectedFilm.year }} · {{ selectedFilm.runtime }}</p><h2 id="film-dialog-title" class="mt-3 font-display text-4xl italic">{{ selectedFilm.title }}</h2><p class="mt-3 max-w-md text-sm leading-[1.6] text-[var(--ink)]/65">{{ selectedFilm.description }}</p></div><a href="mailto:studio@amarakato.com?subject=Viewing%20request" @click="selectedFilm = null" class="inline-flex shrink-0 items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[var(--coral)]" data-testid="link-film-enquiry">Enquire about a screening <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M8 5h11v11" /></svg></a></div>
      </div>
    </div>
  </div>
</template>