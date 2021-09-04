<template>
  <div class="player">
    <progress
      :value="playTime"
      :max="duration"
      @click="seekHandler($event)"
    ></progress>
    <div class="controls">
      <button
        type="button"
        class="action-button"
        @click="togglePlay()"
      >
        <span
          v-show="isPlaying"
          class="pause-icon"
        >
          <i class="far fa-pause-circle"></i>
        </span>
        <span
          v-show="!isPlaying"
          class="play-icon"
        >
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
      @emptied="emptiedHandler()"
      @durationchange="durationHandler($event)"
      @play="playHandler()"
      @playing="playHandler()"
      @pause="pauseHandler()"
      @timeupdate="timeupdateHandler($event)"
      @waiting="waitingHandler()"
      @stalled="stalledHandler($event)"
      @ended="endHandler()"
    >
    </audio>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import store from '@/simpleStore';

export default defineComponent({
  name: 'Player',
  data() {
    return {
      isPlaying: true,
      isLoading: true,
      isError: false,
      duration: 0,
      playTime: 0,
      playingEp: store.getPlayingEp()
    }
  },
  created() {
    library.add(faPlayCircle, faPauseCircle, faSpinner, faExclamationTriangle);
  },
  mounted() {
    // Rendered icons will be transfered once. Therefore use 'v-show' instead of 'v-if'.
    dom.i2svg();
  },
  methods: {
    seekHandler(event: MouseEvent): void {
      const progress = event.target as HTMLProgressElement;
      (this.$refs.audioPlayer as HTMLAudioElement).currentTime = Math.floor(this.duration) * (event.offsetX / progress.offsetWidth);
    },
    emptiedHandler(): void {
      this.isLoading = true;
      this.duration = 0;
    },
    durationHandler(event: Event): void {
      this.duration = (event.target as HTMLAudioElement).duration;
    },
    playHandler(): void {
      this.isPlaying = true;
      this.isLoading = false;
      this.isError = false;
    },
    pauseHandler(): void {
      this.isPlaying = false;
    },
    timeupdateHandler(event: Event): void {
      const { currentTime } = (event.target as HTMLAudioElement);
      this.playTime = currentTime;
    },
    waitingHandler(): void {
      this.isLoading = true;
    },
    stalledHandler(event: Event): void {
      this.isPlaying = false;
      this.isLoading = false;
      this.isError = true;
      (event.target as HTMLAudioElement).pause();
    },
    endHandler(): void {
      store.requestNextEp(this.playingEp.guid);
    },
    togglePlay(): void {
      const player = this.$refs.audioPlayer as HTMLAudioElement;
      if (this.isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    },
    formatTime(seconds: number): string {
      seconds = Math.round(seconds)
      const sec = (seconds % 60).toString().padStart(2, '0');
      const min = Math.floor((seconds / 60) % 60).toString().padStart(2, '0');
      const hr = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const showHr = this.duration >= 60 * 60 * 60;
      return `${showHr ? hr + ':' : ''}${min}:${sec}`;
    }
  }
});
</script>

<style scoped lang="scss">
@use 'sass:color';
@import "/src/variables.scss";

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
