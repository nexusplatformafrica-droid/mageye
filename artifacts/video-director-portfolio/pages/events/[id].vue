<script setup lang="ts">
import { computed } from 'vue';
import { useSiteContent } from '~/composables/useSiteContent';

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const basePath = runtimeConfig.app.baseURL.replace(/\/$/, '');
const asset = (path: string) => path.startsWith('data:') || path.startsWith('http') ? path : `${basePath}${path}`;
const { content } = useSiteContent();
const story = computed(() => content.value.posts.find((post) => post.id === route.params.id));

const youtubeEmbed = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^?&/]+)/);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : '';
};

useHead(() => ({
  title: `${story.value?.title ?? 'Story'} — Mageye`,
  meta: [{ name: 'description', content: story.value?.excerpt ?? 'A story from Mageye Studio.' }],
}));

if (!story.value) {
  throw createError({ statusCode: 404, statusMessage: 'Story not found' });
}
</script>

<template>
  <div v-if="story" class="event-page min-h-[100dvh] bg-[var(--paper)] text-[var(--ink)]">
    <header class="project-header wide-frame flex items-center justify-between">
      <NuxtLink to="/" class="group flex items-center gap-3">
        <img :src="asset('/images/hassan-mageye.png')" alt="Mageye logo" class="site-logo project-mark" />
        <span class="font-display text-xl tracking-[-.04em]">Mageye</span>
      </NuxtLink>
      <NuxtLink to="/#story" class="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[var(--coral)] transition-transform hover:translate-x-1">All stories <span aria-hidden="true">↗</span></NuxtLink>
    </header>

    <main>
      <section class="event-intro wide-frame">
        <div>
          <p class="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[var(--coral)]">{{ story.kind }} · {{ story.category }} · {{ story.date }}</p>
          <h1 class="mt-7 max-w-[1050px] font-display text-[clamp(3.4rem,8vw,9.2rem)] leading-[.8] tracking-[-.09em]">{{ story.title }}</h1>
          <p class="mt-8 max-w-[650px] text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.5] text-[var(--ink)]/66">{{ story.excerpt }}</p>
        </div>
      </section>

      <section class="wide-frame event-hero-media">
        <img :src="asset(story.image)" :alt="story.title" />
        <p class="mt-3 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--ink)]/46">{{ story.sourceCredit }}</p>
      </section>

      <section class="wide-frame event-reading-layout">
        <aside class="event-reading-aside">
          <span class="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[var(--ink)]/45">Filed by</span>
          <strong>{{ story.author }}</strong>
          <span>{{ story.sourceName }}</span>
        </aside>
        <article class="event-rich-copy">
          <div v-html="story.body"></div>
          <div v-if="youtubeEmbed(story.videoUrl)" class="event-video">
            <iframe :src="youtubeEmbed(story.videoUrl)" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
          <a v-if="story.buttonLabel && story.buttonUrl" :href="story.buttonUrl" target="_blank" rel="noopener noreferrer" class="soft-button event-story-button">{{ story.buttonLabel }} <span aria-hidden="true">↗</span></a>
          <a v-else-if="story.source" :href="story.source" target="_blank" rel="noopener noreferrer" class="event-source-link">Read the original source <span>↗</span></a>
        </article>
      </section>
    </main>
  </div>
</template>