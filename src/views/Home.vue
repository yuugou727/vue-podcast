<template>
  <div class="channel">
    <ChannelHeader
      :imgSrc="imgSrc"
      :title="title"
    />

    <div class="episodes">
      <div
        class="episode"
        v-for="(episode, idx) in episodes"
        :key="idx"
        @click="navTo(episode)"
      >
        <div class="image-container">
          <img
            :src="episode.itunes.image"
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
import RSSParser from 'rss-parser';
import ChannelHeader from '@/components/ChannelHeader.vue';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const feedUrl =
  'https://api.soundon.fm/v2/podcasts/954689a5-3096-43a4-a80b-7810b219cef3/feed.xml';

export default defineComponent({
  name: "Home",
  components: {
    ChannelHeader
  },
  props: ['feed'],
  data() {
    return {
      imgSrc: '' as string,
      title: '' as string,
      episodes: [] as any[],
    };
    },
    async created() {
      let parser = new RSSParser();
      let feed = await parser.parseURL(CORS_PROXY + feedUrl);
      if (feed.title && feed.image) {
        this.imgSrc = feed.image.url;
        this.title = feed.title;
        console.log(feed);
        this.episodes = feed.items;
      }
  },
  methods: {
    dateFormat(input: string): string {
      return format(new Date(input), 'yyyy-MM-dd');
    },
    navTo(episode: any): void {
      const { guid, title, enclosure, itunes } = episode;
      this.$router.push({
        name: 'Episode', params: {
          guid,
          // above will be assigned to attrs
          imgSrc: itunes.image,
          title,
          htmlDesc: episode['content:encoded'],
          mediaType: enclosure.type,
          mediaUrl: enclosure.url
        }
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