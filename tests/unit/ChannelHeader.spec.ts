import { shallowMount } from '@vue/test-utils'
import ChannelHeader from '@/components/ChannelHeader.vue'

describe('ChannelHeader.vue', () => {
  it('renders props.title when passed', () => {
    const titleText = 'Title Test';
    const wrapper = shallowMount(ChannelHeader, {
      props: { title: titleText }
    })
    const title = wrapper.find('.title');
    expect(title.text()).toMatch(titleText);
  })

  it('won\'t render play button when props.showPlayBtn not passed', () => {
    const wrapper = shallowMount(ChannelHeader);
    expect(wrapper.find('button').exists()).toBeFalsy();
  })

  it('renders \'PLAY\' button when props.showPlayBtn passed', () => {
    const wrapper = shallowMount(ChannelHeader, {
      props: { showPlayBtn: true }
    });
    expect(wrapper.find('button').exists());
  })

  it('emits onPlay event when Play button clicked ', async () => {
    const wrapper = shallowMount(ChannelHeader, {
      props: { showPlayBtn: true }
    });
    await wrapper.find('.play-btn').trigger('click');
    expect(wrapper.emitted().onPlay.length).toBe(1);
  })

  it('renders \'ON AIR\' disabled button when props.isNowPlaying passed', async() => {
    const wrapper = shallowMount(ChannelHeader, {
      props: { showPlayBtn: true, isNowPlaying: true}
    });
    expect( wrapper.find('.play-btn').text()).toBe('ON AIR');
    await wrapper.find('.play-btn').trigger('click');
    expect(wrapper.emitted('onPlay')).toBeFalsy();
  })
})
