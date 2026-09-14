<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
  title: string;
  src: string;
  poster?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const video = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const showVolume = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const buffered = ref(0);
const playbackRate = ref(1);
const showSettings = ref(false);
const hasError = ref(false);

const hasSource = computed(() => Boolean(props.src));
const progress = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0);
const bufferedProgress = computed(() => duration.value ? (buffered.value / duration.value) * 100 : 0);

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const remaining = String(total % 60).padStart(2, '0');
  return `${minutes}:${remaining}`;
};

const syncTime = () => {
  const player = video.value;
  if (!player) return;
  currentTime.value = player.currentTime;
  if (player.buffered.length) buffered.value = player.buffered.end(player.buffered.length - 1);
};

const syncDuration = () => {
  if (video.value) duration.value = video.value.duration;
};

const play = async () => {
  const player = video.value;
  if (!player) return;
  try {
    await player.play();
  } catch {
    // Browsers may block autoplay; the visible play button remains available.
  }
};

const togglePlay = () => {
  const player = video.value;
  if (!player) return;
  if (player.paused) {
    void play();
  } else {
    player.pause();
  }
};

const seek = (event: Event) => {
  const player = video.value;
  const input = event.target as HTMLInputElement;
  if (!player || !duration.value) return;
  player.currentTime = Number(input.value);
  currentTime.value = player.currentTime;
};

const skip = (amount: number) => {
  const player = video.value;
  if (!player) return;
  player.currentTime = Math.min(Math.max(0, player.currentTime + amount), player.duration || 0);
  syncTime();
};

const toggleMute = () => {
  const player = video.value;
  if (!player) return;
  player.muted = !player.muted;
  isMuted.value = player.muted;
  if (player.muted) showVolume.value = false;
};

const setVolume = (event: Event) => {
  const player = video.value;
  if (!player) return;
  player.volume = Number((event.target as HTMLInputElement).value);
  player.muted = player.volume === 0;
  isMuted.value = player.muted;
};

const changeRate = (rate: number) => {
  if (!video.value) return;
  video.value.playbackRate = rate;
  playbackRate.value = rate;
  showSettings.value = false;
};

const toggleFullscreen = async () => {
  const player = video.value;
  if (!player) return;
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await player.parentElement?.requestFullscreen();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (showSettings.value) {
      showSettings.value = false;
      return;
    }
    emit('close');
  }
  if (event.key === ' ') {
    event.preventDefault();
    togglePlay();
  }
  if (event.key === 'ArrowLeft') skip(-10);
  if (event.key === 'ArrowRight') skip(10);
};

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  await nextTick();
  void play();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  video.value?.pause();
});
</script>

<template>
  <div class="classic-player" @click.stop>
    <div class="classic-player-stage" :class="{ 'classic-player-stage-error': hasError }">
      <video
        ref="video"
        class="classic-player-video"
        :src="props.src"
        :poster="props.poster"
        playsinline
        preload="metadata"
        @click="togglePlay"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @timeupdate="syncTime"
        @progress="syncTime"
        @loadedmetadata="syncDuration"
        @durationchange="syncDuration"
        @error="hasError = true"
      />
      <div v-if="!hasSource" class="classic-player-error">
        <span class="classic-player-error-icon">▶</span>
        <p>Trailer coming soon.</p>
        <span class="classic-player-error-note">A preview will be added for this film.</span>
      </div>
      <div v-else-if="hasError" class="classic-player-error">
        <span class="classic-player-error-icon">!</span>
        <p>We couldn’t load this trailer.</p>
        <a :href="props.src" target="_blank" rel="noreferrer">Open video directly <span aria-hidden="true">↗</span></a>
      </div>
      <button v-if="hasSource && !isPlaying && !hasError" type="button" class="classic-player-center-play" aria-label="Play trailer" @click="togglePlay">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7V5Z" /></svg>
      </button>
      <div class="classic-player-topbar">
        <div class="classic-player-brand"><span class="classic-player-brand-mark">M</span><span>MAGEYE</span></div>
        <div class="classic-player-title">{{ props.title }}</div>
        <button type="button" class="classic-player-close" aria-label="Close trailer" @click="emit('close')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div v-if="hasSource" class="classic-player-controls">
        <div class="classic-player-progress">
          <div class="classic-player-buffered" :style="{ width: `${bufferedProgress}%` }" />
          <div class="classic-player-progress-value" :style="{ width: `${progress}%` }" />
          <input
            class="classic-player-range classic-player-seek"
            type="range"
            min="0"
            :max="duration || 0"
            :value="currentTime"
            step="0.1"
            aria-label="Seek through trailer"
            @input="seek"
          />
        </div>
        <div class="classic-player-control-row">
          <div class="classic-player-controls-left">
            <button type="button" class="classic-player-control-button" :aria-label="isPlaying ? 'Pause trailer' : 'Play trailer'" @click="togglePlay">
              <svg v-if="isPlaying" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7V5Z" /></svg>
            </button>
            <button type="button" class="classic-player-control-button classic-player-skip" aria-label="Back 10 seconds" @click="skip(-10)">
              <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M12 5a8 8 0 1 0 6.5 13" /><path d="M12 2v6l-5-3" /><path d="M22 8v8l5-4-5-4Z" /></svg><span>10</span>
            </button>
            <button type="button" class="classic-player-control-button classic-player-skip" aria-label="Forward 10 seconds" @click="skip(10)">
              <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M20 5a8 8 0 1 1-6.5 13" /><path d="M20 2v6l5-3" /><path d="M10 8v8l-5-4 5-4Z" /></svg><span>10</span>
            </button>
            <span class="classic-player-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
          <div class="classic-player-controls-right">
            <div class="classic-player-volume" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
              <input v-if="showVolume" class="classic-player-range classic-player-volume-range" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume" @input="setVolume" />
              <button type="button" class="classic-player-control-button" :aria-label="isMuted ? 'Unmute trailer' : 'Mute trailer'" @click="toggleMute">
                <svg v-if="isMuted" viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 16M10 8.2 7 6v12l3-2.2 4 3V5.2l-4 3ZM19 9a5 5 0 0 1 0 6" /></svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4ZM16 9a5 5 0 0 1 0 6M18.5 6.5a9 9 0 0 1 0 11" /></svg>
              </button>
            </div>
            <div class="classic-player-settings">
              <button type="button" class="classic-player-control-button" aria-label="Playback settings" :aria-expanded="showSettings" @click="showSettings = !showSettings">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.2 2.3 2.5.6.8 2.4 2.2 1.3-.9 2.4.9 2.4-2.2 1.3-.8 2.4-2.5.6L12 21l-1.2-2.3-2.5-.6-.8-2.4-2.2-1.3.9-2.4-.9-2.4 2.2-1.3.8-2.4 2.5-.6L12 3Z" /><circle cx="12" cy="12" r="2.5" /></svg>
              </button>
              <div v-if="showSettings" class="classic-player-settings-menu">
                <span>Playback speed</span>
                <button v-for="rate in [0.75, 1, 1.25, 1.5]" :key="rate" type="button" :class="{ active: playbackRate === rate }" @click="changeRate(rate)">{{ rate }}×</button>
              </div>
            </div>
            <button type="button" class="classic-player-control-button" aria-label="Fullscreen" @click="toggleFullscreen">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>