<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const nuxtApp = useNuxtApp();
const isLoading = ref(true);
const minimumLoaderDuration = 520;
let loaderStartedAt = 0;
let finishTimer: ReturnType<typeof setTimeout> | null = null;

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

const finishLoading = () => {
  if (!import.meta.client) return;

  const elapsed = performance.now() - loaderStartedAt;
  const remaining = Math.max(0, minimumLoaderDuration - elapsed);

  clearFinishTimer();
  finishTimer = setTimeout(() => {
    isLoading.value = false;
    finishTimer = null;
  }, remaining);
};

nuxtApp.hook('page:start', startLoading);
nuxtApp.hook('page:finish', finishLoading);

onMounted(() => {
  loaderStartedAt = performance.now();
  finishLoading();
});

onBeforeUnmount(clearFinishTimer);
</script>

<template>
  <Transition name="page-loader">
    <div v-if="isLoading" class="page-loader" role="status" aria-live="polite" aria-label="Loading page">
      <div class="loader" aria-hidden="true"></div>
    </div>
  </Transition>

  <NuxtPage />
</template>