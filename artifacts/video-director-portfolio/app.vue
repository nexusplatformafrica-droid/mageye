<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const nuxtApp = useNuxtApp();
const isLoading = ref(true);
const minimumLoaderDuration = 520;
let loaderStartedAt = 0;
let finishTimer: ReturnType<typeof setTimeout> | null = null;
let loadingRequestId = 0;

const clearFinishTimer = () => {
  if (!finishTimer) return;
  clearTimeout(finishTimer);
  finishTimer = null;
};

const startLoading = () => {
  if (!import.meta.client) return;
  clearFinishTimer();
  loaderStartedAt = performance.now();
  isLoading.value = true;
};

const waitForImage = (src: string) => new Promise<void>((resolve) => {
  if (!src || src.startsWith('data:')) {
    resolve();
    return;
  }

  const image = new Image();
  let settled = false;
  const settle = () => {
    if (settled) return;
    settled = true;
    image.onload = null;
    image.onerror = null;
    resolve();
  };

  image.onload = settle;
  image.onerror = settle;
  image.src = src;

  if (image.complete) settle();
});

const collectCssImageUrls = () => {
  const cssImageUrls = new Set<string>();
  const cssUrlPattern = /url\(["']?(.*?)["']?\)/g;

  document.querySelectorAll<HTMLElement>('*').forEach((element) => {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;
    let match: RegExpExecArray | null;

    while ((match = cssUrlPattern.exec(backgroundImage)) !== null) {
      const rawUrl = match[1]?.trim();
      if (!rawUrl || rawUrl.startsWith('data:')) continue;

      try {
        cssImageUrls.add(new URL(rawUrl, window.location.href).href);
      } catch {
        // Ignore malformed CSS URLs; the page can still finish loading.
      }
    }
  });

  return cssImageUrls;
};

const waitForRenderedAssets = async () => {
  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  const renderedImages = Array.from(document.images);
  renderedImages.forEach((image) => {
    // Lazy images are intentionally promoted while the loader is visible so
    // the first reveal does not show empty tiles further down the page.
    image.loading = 'eager';
  });

  const imageUrls = renderedImages
    .map((image) => image.currentSrc || image.src)
    .filter(Boolean);
  const posterUrls = Array.from(document.querySelectorAll<HTMLVideoElement>('video[poster]'))
    .map((video) => video.poster)
    .filter(Boolean);

  await Promise.all([
    ...new Set([...imageUrls, ...posterUrls, ...collectCssImageUrls()]),
  ].map((src) => waitForImage(src)));

  if (document.fonts?.ready) await document.fonts.ready;
};

const finishLoading = async () => {
  if (!import.meta.client) return;

  const requestId = loadingRequestId;
  await waitForRenderedAssets();
  if (requestId !== loadingRequestId) return;

  const elapsed = performance.now() - loaderStartedAt;
  const remaining = Math.max(0, minimumLoaderDuration - elapsed);

  clearFinishTimer();
  finishTimer = setTimeout(() => {
    if (requestId !== loadingRequestId) return;
    isLoading.value = false;
    finishTimer = null;
  }, remaining);
};

nuxtApp.hook('page:start', startLoading);
nuxtApp.hook('page:start', () => {
  loadingRequestId += 1;
});
nuxtApp.hook('page:finish', () => {
  void finishLoading();
});

onMounted(() => {
  loaderStartedAt = performance.now();
  void finishLoading();
});

onBeforeUnmount(clearFinishTimer);
</script>

<template>
  <Transition name="page-loader">
    <div v-if="isLoading" class="page-loader" role="status" aria-live="polite" aria-label="Loading page">
      <div class="loader" aria-hidden="true">
        <span class="loader-core"></span>
      </div>
    </div>
  </Transition>

  <NuxtPage />
</template>