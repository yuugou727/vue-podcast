import { shallowMount } from '@vue/test-utils'
import Player from '@/components/Player.vue'
import store from '@/simpleStore';

const testPlaying = {
  guid: 'abe95f26-fb50-4c52-9c85-1cbcd1eda2bf',
  mediaType: 'audio/mpeg',
  mediaUrl: 'https://chtbl.com/track/4B4E1D/rss.soundon.fm/rssf/954689a5-3096-43a4-a80b-7810b219cef3/feedurl/abe95f26-fb50-4c52-9c85-1cbcd1eda2bf/rssFileVip.mp3?timestamp=1630487464505',
  title: 'EP171 | ☆㊣↙GG614↗㊣☆'
};

describe('Player.vue', () => {
  beforeEach(() => {
    store.setPlaying({
      guid: '',
      mediaType: '',
      mediaUrl: '',
      title: ''
    });
    store.setPlaying(testPlaying);
  });

  it('audio has autoplay attribute', () => {
    const wrapper = shallowMount(Player);
    expect(wrapper.find('audio').element.autoplay).toBeTruthy();
  });

  it('renders play and pause icons', () => {
    const wrapper = shallowMount(Player);
    expect(wrapper.find('.pause-icon').exists()).toBe(true);
    expect(wrapper.find('.play-icon').exists()).toBe(true);
  });

  it('displays pause button by default', () => {
    const wrapper = shallowMount(Player);
    expect(wrapper.find('.play-icon').isVisible()).toBe(false);
    expect(wrapper.find('.pause-icon').isVisible()).toBe(true);
  });

  it('renders title when store playingEp is given', () => {
    const wrapper = shallowMount(Player);
    const title = wrapper.find('.title');
    expect(title.text()).toMatch(testPlaying.title);
  });

  it('loads audio source correctly', async () => {
    const wrapper = shallowMount(Player);
    const audio = wrapper.find('audio');
    expect(audio.attributes('type')).toMatch(testPlaying.mediaType);
    expect(audio.attributes('src')).toMatch(testPlaying.mediaUrl);
  });

  it('action buttons work', async () => {
    const wrapper = shallowMount(Player);
    const spy = jest.spyOn(wrapper.vm, 'togglePlay');
    await wrapper.find('.action-button').trigger('click');
    expect(spy).toBeCalledTimes(1);
  });
});
