<template>
  <div class="header">
    <div class="image-container">
      <img
        v-if="imgSrc"
        alt="Channel Image"
        :src="imgSrc"
      />
    </div>
    <h3 class="title">{{ title }}</h3>
    <div
      v-if="showPlayBtn"
      class="play-container"
    >
      <button
        type="button"
        class="play-btn"
        @click="$emit('onPlay')"
        :disabled="isNowPlaying"
      >{{ isNowPlaying ? 'ON AIR' : 'PLAY' }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChannelHeader',
  props: {
    imgSrc: String,
    title: String,
    showPlayBtn: Boolean,
    isNowPlaying: Boolean
  },
  emits: [
    'onPlay'
  ]
})
</script>

<style lang="scss" scoped>
@import '/src/variables.scss';

.header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 24px;

  .image-container {
    width: 250px;
    height: 250px;
  }
  img {
    min-height: 250px;
    background-color: grey;
    max-width: 250px;
  }

  .title {
    margin: 12px 24px;
    font-size: 36px;
  }

  .play-container {
    margin-left: auto;

    .play-btn {
      font-size: 16px;
      background-color: transparent;
      color: $theme-color;
      border: 2px solid $theme-color;
      border-radius: 6px;
      padding: 6px 14px;
      margin-bottom: 12px;
      white-space: nowrap;

      &:disabled {
        color: orange;
        border-color: orange;
      }

      &:not(:disabled):hover {
        background-color: $theme-color;
        color: $bg-color;
        cursor: pointer;
      }
    }
  }
}
</style>