<template>
  <div class="player">
    <progress
      ref="progressBar"
      :value="playTime"
      :max="duration"
    ></progress>
    <div class="controls">
      <button
        type="button"
        class="action-button"
        @click="togglePlay"
        :disabled="isEmpty"
      >
        <span v-show="isPlaying">
          <i class="far fa-pause-circle"></i>
        </span>
        <span v-show="!isPlaying">
          <i class="far fa-play-circle"></i>
        </span>
      </button>
      <p class="title">{{ playingEp.title }}</p>
      <div class="hint">
        <span v-show="isLoading">
          <i class="fas fa-spinner fa-pulse"></i>
        </span>
        <span
          v-show="isError"
          class="error"
        >
          <i class="fas fa-exclamation-triangle"></i>
        </span>
      </div>
      <p class="duration">{{ formatTime(playTime)}} / {{formatTime(duration) }}</p>
    </div>
    <audio
      ref="audioPlayer"
      autoplay
      :src="playingEp.mediaUrl"
      :type="playingEp.mediaType"
    >
    </audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import store from '@/simpleStore';

export default defineComponent({
  name: 'Player',
  setup() {
    // template ref
    const audioPlayer = ref<HTMLAudioElement | null>(null);
    const progressBar = ref<HTMLProgressElement | null>(null);
    // audio properties
    const isPlaying = ref<boolean>(true);
    const isEmpty = ref<boolean>(true);
    const isLoading = ref<boolean>(false);
    const isError = ref<boolean>(false);
    const duration = ref<number>(0);
    const playTime = ref<number>(0);
    // store getter
    const playingEp = store.getPlayingEp();

    /** Font-awesome */
    library.add(faPlayCircle, faPauseCircle, faSpinner, faExclamationTriangle);
    onMounted(() => {
      dom.i2svg();
    })

    /** customize audio player events */
    const seekHandler = (event: MouseEvent) => {
      const progress = event.target as HTMLProgressElement;
      (audioPlayer.value as HTMLAudioElement).currentTime = Math.floor(duration.value) * (event.offsetX / progress.offsetWidth);
    }
    const emptyHandler = () => {
      isEmpty.value = true;
      isLoading.value = true;
      duration.value = 0;
    };
    const metaHandler = (event: Event): void => {
      isEmpty.value = false;
      duration.value = (event.target as HTMLAudioElement).duration;
    };
    const playHandler = (): void => {
      isPlaying.value = true;
      isLoading.value = false;
      isError.value = false;
    };
    const pauseHandler = (): void => {
      isPlaying.value = false;
    };
    const timeupdateHandler = (event: Event): void => {
      const { currentTime } = (event.target as HTMLAudioElement);
      playTime.value = currentTime;
    }
    const waitingHandler = (): void => {
      isLoading.value = true;
    };
    const stalledHandler = (event: Event): void => {
      isLoading.value = false;
      isError.value = true;
      (event.target as HTMLAudioElement).pause();
    };
    const endHandler = (): void => {
      store.requestNextEp(playingEp.value.guid);
    };

    onMounted((): void => {
      progressBar.value?.addEventListener('click', seekHandler);
      const player = audioPlayer.value as HTMLAudioElement;
      player.addEventListener('emptied', emptyHandler);
      player.addEventListener('loadedmetadata', metaHandler);
      player.addEventListener('play', playHandler);
      player.addEventListener('playing', playHandler);
      player.addEventListener('pause', pauseHandler);
      player.addEventListener('timeupdate', timeupdateHandler);
      player.addEventListener('waiting', waitingHandler);
      player.addEventListener('stalled', stalledHandler);
      player.addEventListener('ended', endHandler);
    });
    onBeforeUnmount((): void => {
      progressBar.value?.removeEventListener('click', seekHandler);
      const player = audioPlayer.value as HTMLAudioElement;
      player.removeEventListener('emptied', emptyHandler);
      player.removeEventListener('loadedmetadata', metaHandler);
      player.removeEventListener('play', playHandler);
      player.removeEventListener('playing', playHandler);
      player.removeEventListener('pause', pauseHandler);
      player.removeEventListener('timeupdate', timeupdateHandler);
      player.removeEventListener('waiting', waitingHandler);
      player.removeEventListener('stalled', stalledHandler);
      player.removeEventListener('ended', endHandler);
    });

    /** methods */
    const togglePlay = (): void => {
      if (isPlaying.value) {
        audioPlayer.value?.pause();
      } else {
        audioPlayer.value?.play();
      }
      isPlaying.value = !isPlaying.value;
    }

    const formatTime = (seconds: number): string => {
      seconds = Math.round(seconds)
      const sec = (seconds % 60).toString().padStart(2, '0');
      const min = Math.floor((seconds / 60) % 60).toString().padStart(2, '0');
      const hr = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const showHr = duration.value >= 60 * 60 * 60;
      return `${showHr ? hr + ':' : ''}${min}:${sec}`;
    }

    return {
      isEmpty,
      isLoading,
      isPlaying,
      isError,
      playTime,
      duration,
      // computed store
      playingEp,
      // refs
      progressBar,
      audioPlayer,
      // methods
      formatTime,
      togglePlay,
    };
  },
});
</script>

<style scoped lang="scss">
@use 'sass:color';
@import '/src/variables.scss';

.player {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  height: 80px;
  background-color: #0009;
  backdrop-filter: blur(8px);

  progress {
    flex: 1 0 100%;
    height: 8px;
    border-radius: 0;
    appearance: none;

    &[value]::-webkit-progress-bar {
      background-color: #555;
      border-radius: 0;
    }

    &[value]::-webkit-progress-value {
      background: color.adjust($theme-color, $lightness: 5%);
      box-shadow: 0 0 8px color.adjust($theme-color, $lightness: 10%);
    }
  }

  .controls {
    display: flex;
    width: 100%;
    align-items: center;

    .action-button {
      color: white;
      background-color: transparent;
      border: 0;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      padding: 0;
      margin: 0 24px;

      &:not(:disabled):hover {
        background-color: #fff4;
      }

      &:disabled {
        color: #fff4;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      margin-right: 8px;
    }

    .hint span {
      font-size: 18px;
      &.error {
        color: $error-color;
      }
    }

    .duration {
      margin-left: auto;
      margin-right: 24px;
    }
  }
}
</style>
