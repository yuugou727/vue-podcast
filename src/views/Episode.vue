<template>
  <div class="episode">
    <ChannelHeader
      :imgSrc="imgSrc"
      :title="title"
      :showPlayBtn="true"
      @onPlay="play"
    />
    <div v-html="htmlDesc"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import bus from '@/bus.ts';
import ChannelHeader from '@/components/ChannelHeader.vue';

export default defineComponent({
  name: 'Episode',
  components: {
    ChannelHeader
  },
  props: {
    guid: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const { htmlDesc, imgSrc, title, mediaType, mediaUrl } = context.attrs;
    const play = () => {
      bus.emit('request', {
        title: title as string,
        guid: props.guid as string,
        type: mediaType as string,
        url: mediaUrl as string,
      });
    }
    return { htmlDesc, imgSrc, title, play }
  }

})
</script>

<style lang="scss" scoped>
.episode {
  margin: 12px 24px;
}
</style>