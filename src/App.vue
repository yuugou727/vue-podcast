<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive exclude="Episode">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <div class="bottom-player">
    <Player />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Player from '@/components/Player.vue';

export default defineComponent({
  components: {
    Player
  }
})
</script>

<style lang="scss">
html,
body {
  background-color: #2c3e50;
  color: white;
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bottom-player {
  width: 100%;
  height: 80px;
  background-color: #0006;
  backdrop-filter: blur(8px);
  position: fixed;
  bottom: 0;
}
</style>
