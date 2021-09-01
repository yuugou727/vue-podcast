<template>
  <div class="episode">
    <ChannelHeader
      :imgSrc="imgSrc"
      :title="title"
      :showPlayBtn="true"
      @onPlay="play"
    />
    <div class="description">
      <p>{{parsedContent}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/simpleStore';
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
  setup(props) {
    const episode = store.getEpisode(props.guid).value;
    if (!episode) {
      // fallback to channel page
      const router = useRouter();
      router.replace({ name: 'Home' });
      return;
    }
    const { content, itunes, title } = episode;
    const imgSrc = itunes.image;
    const parsedContent = content.trim();
    const play = () => {
      store.requestPlay(props.guid);
    }
    return { imgSrc, title, parsedContent, play }
  }
})
</script>

<style lang="scss" scoped>
.episode {
  margin: 12px 24px;

  .description {
    margin-bottom: 100px;
    white-space: pre-wrap;
  }
}
</style>