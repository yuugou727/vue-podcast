<template>
  <div class="player">
    <audio
      ref="audioPlayer"
      controls
      autoplay
      :src="mediaUrl"
      :type="mediaType"
    >
    </audio>
    {{ mediaTitle }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue';
import bus from '@/bus.ts';

export default defineComponent({
  name: 'Player',
  setup() {
    const audioPlayer = ref<HTMLAudioElement | null>(null);
    const mediaTitle = ref<string>('');
    const mediaGuid = ref<string>('');
    const mediaUrl = ref<string>('');
    const mediaType = ref<string>('');

    const requestHandler = ({ title, guid, type, url }: { title: string, guid: string, type: string, url: string }) => {
      mediaTitle.value = title;
      mediaGuid.value = guid;
      mediaType.value = type;
      mediaUrl.value = url;
    }

    const endHandler = () => {
      bus.emit('playEnd', { guid: mediaGuid.value });
    };

    bus.on('request', requestHandler);
    audioPlayer.value?.addEventListener('ended', endHandler);
    onBeforeUnmount(() => {
      bus.off('request', requestHandler);
      audioPlayer.value?.removeEventListener('ended', endHandler);
    });

    return { mediaTitle, audioPlayer, mediaUrl, mediaType };
  },
});
</script>

<style scoped lang="scss">
</style>
