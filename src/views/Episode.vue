<template>
  <div class="episode">
    <ChannelHeader
      :imgSrc="episode?.itunes?.image"
      :title="episode?.title"
      :showPlayBtn="true"
      :isNowPlaying="isNowPlaying"
      @onPlay="play()"
    />
    <div class="description">
      <p>{{episode?.content}}</p>
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
  data() {
    return {
      episode: store.getEpisode(this.guid),
      isNowPlaying: store.getIsNowPlaying(this.guid),
    }
  },
  mounted() {
    if (!this.episode) {
      // fallback to channel page
      const router = useRouter();
      router.replace({ name: 'Home' });
    }
  },
  methods: {
    play(): void {
      store.requestPlay(this.guid);
    }
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