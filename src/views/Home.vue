<template>
  <div class="channel">
    <ChannelHeader
      :imgSrc="feed.image?.url"
      :title="feed.title"
    />

    <div class="episodes">
      <div
        class="episode"
        v-for="(episode, idx) in feed.items"
        :key="idx"
        @click="navTo(episode)"
      >
        <div class="image-container">
          <img
            :src="episode.itunes?.image"
            loading="lazy"
          >
        </div>
        <div class="info">
          <p class="name">{{ episode.title }}</p>
          <p class="date">{{ dateFormat(episode.isoDate) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { format } from 'date-fns';
import { IEpisode } from '@/interfaces/feed.interface';
import store from '@/simpleStore';
import ChannelHeader from '@/components/ChannelHeader.vue';

export default defineComponent({
  name: "Home",
  components: {
    ChannelHeader
  },
  data() {
    return {
      feed: store.getFeed()
    };
  },
  methods: {
    dateFormat(input: string): string {
      return format(new Date(input), 'yyyy-MM-dd');
    },
    navTo(episode: IEpisode): void {
      this.$router.push({
        name: 'Episode', params: { guid: episode.guid }
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.channel {
  margin: 12px 24px;

  .episode {
    display: flex;
    flex-basis: 100%;
    align-items: center;
    cursor: pointer;
    padding: 8px;

    &:hover {
      background-color: #fff1;
    }

    .image-container {
      margin-right: 16px;
      width: 80px;
      height: 80px;
    }
    img {
      width: 80px;
      height: 80px;
    }
    .name {
      font-weight: 600;
    }
    .date {
      font-size: smaller;
    }
  }
}
</style>