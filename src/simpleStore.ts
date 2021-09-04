import { computed, ComputedRef, reactive } from 'vue';
import { IEpisode, IFeed } from './interfaces/feed.interface';
interface IPlayingEp {
  guid: string;
  title: string;
  mediaType: string;
  mediaUrl: string;
}

const store = {
  state: reactive<{ feed: IFeed, playingEp: IPlayingEp }>({
    feed: {
      title: '',
      image: {
        link: '',
        title: '',
        url: '',
      },
      items: []
    },
    playingEp: {
      guid: '',
      title: '',
      mediaType: '',
      mediaUrl: ''
    },
  }),

  /** Setters (Commit Mutation) */
  setFeed(newValue: IFeed): void {
    this.state.feed = { ...newValue };
  },

  setPlaying(newValue: IPlayingEp): void {
    this.state.playingEp = {...newValue};
  },

  /** Getters: computedRef */
  getFeed(): ComputedRef<IFeed> {
    return computed(() => this.state.feed);
  },

  getEpisode(guid: string): ComputedRef<IEpisode | undefined> {
    return computed(() => this.state.feed.items.find((el: IEpisode) => el.guid === guid));
  },

  getPlayingEp(): ComputedRef<IPlayingEp> {
    return computed(() => this.state.playingEp);
  },

  getIsNowPlaying(guid: string): ComputedRef<boolean>{
    return computed(() => guid === this.state.playingEp.guid);
  },

  /** Actions */
  requestPlay(guid: string): void {
    const episode = this.getEpisode(guid).value;
    if (!episode) {
      return;
    }
    const { title, enclosure } = episode;
    const { type, url } = enclosure;
    this.setPlaying({
      guid,
      title,
      mediaUrl: url,
      mediaType: type
    });
  },

  requestNextEp(guid: string): void {
    const episodes = this.state.feed.items;
    const idx = episodes.findIndex((el: IEpisode) => el.guid === guid);
    if (idx <= 0) {
      return;
    }
    const nextGuid = episodes[idx - 1].guid;
    this.requestPlay(nextGuid);
  }
};

export default store;
