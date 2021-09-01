<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive exclude="Episode">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <div
    v-show="showPlayer"
    class="fixed-bottom"
  >
    <Player />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import Player from '@/components/Player.vue';
import bus from '@/bus.ts';

export default defineComponent({
  components: {
    Player
  },
  setup() {
    const showPlayer = ref<boolean>(false);
    const requestHandler = () => {
      showPlayer.value = true;
    };
    bus.on('request', requestHandler);
    onBeforeUnmount(() => {
      bus.off('request', requestHandler);
    });
    return { showPlayer };
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

.fixed-bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
}
</style>
