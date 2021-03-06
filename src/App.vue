<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive exclude="Episode">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <div
    v-show="!!nowPlaying.mediaUrl"
    class="fixed-bottom"
  >
    <Player />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import RssParser from 'rss-parser';
import { IFeed } from './interfaces/feed.interface';
import store from '@/simpleStore';
import Player from '@/components/Player.vue';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const feedUrl = 'https://api.soundon.fm/v2/podcasts/954689a5-3096-43a4-a80b-7810b219cef3/feed.xml';

export default defineComponent({
  components: {
    Player
  },
  setup() {
    const nowPlaying = store.getPlayingEp();
    onBeforeMount(async () => {
      try {
        const parser = new RssParser<IFeed>();
        const feed = await parser.parseURL(CORS_PROXY + feedUrl);
        if (feed) {
          store.setFeed(feed);
        }
      } catch (err: unknown) {
        console.log(err);
      }
    })
    return { nowPlaying };
  }
})
</script>

<style lang="scss">
@import "/src/variables.scss";

html,
body {
  background-color: $bg-color;
  color: $font-color;
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}

.fixed-bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
}
</style>
