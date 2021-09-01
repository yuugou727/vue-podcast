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
      class="playbutton"
    >
      <button
        type="button"
        @click="$emit('onPlay')"
      >PLAY</button>
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
    showPlayBtn: Boolean
  },
  emits: [
    'onPlay'
  ]
})
</script>

<style lang="scss" scoped>
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

  .playbutton {
    margin-left: auto;

    button {
      font-size: 16px;
      background-color: transparent;
      color: white;
      border: 2px solid white;
      border-radius: 6px;
      padding: 6px 14px;
      cursor: pointer;

      &:hover {
        background-color: white;
        color: #2c3e50;
      }
    }
  }
}
</style>