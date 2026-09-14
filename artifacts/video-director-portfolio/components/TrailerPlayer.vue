<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  src: string;
  poster?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const hasSource = computed(() => Boolean(props.src));
</script>

<template>
  <div class="classic-player" @click.stop>
    <div class="classic-player-stage" :class="{ 'classic-player-stage-empty': !hasSource }">
      <movi-player
        v-if="hasSource"
        class="movi-player"
        :src="props.src"
        :poster="props.poster"
        controls
        autoplay
        playsinline
        preload="metadata"
        aria-label="Trailer player"
      />
      <div v-else class="classic-player-error">
        <span class="classic-player-error-icon">▶</span>
        <p>Trailer coming soon.</p>
        <span class="classic-player-error-note">A preview will be added for this film.</span>
      </div>
      <div class="classic-player-topbar">
        <div class="classic-player-brand"><span class="classic-player-brand-mark">M</span><span>MAGEYE</span></div>
        <div class="classic-player-title">{{ props.title }}</div>
        <button type="button" class="classic-player-close" aria-label="Close trailer" @click="emit('close')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>