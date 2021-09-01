import { computed, ComputedRef, reactive } from 'vue';

type IFeed = {
  title: string;
  image: {
    link: string;
    title: string;
    url: string;
  };
  items: IEpisode[];
  [key: string]: any;
}

interface IEpisode {
  content: string;
  'content:encoded': string;
  itunes: {
    image: string;
    episode: string;
    [key: string]: any
  };
  guid: string;
  enclosure: {
    length: string;
    type: string;
    url: string;
  };
  [key: string]: any;
}

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
  setFeed(newValue: any): void {
    this.state.feed = { ...newValue };
  },

  setPlaying(newValue: IPlayingEp): void {
    this.state.playingEp = {...newValue};
  },

  /** Getters: computedRef */
  getEpisode(guid: string): ComputedRef<IEpisode | undefined> {
    return computed(() => this.state.feed.items.find((el: IEpisode) => el.guid === guid));
  },

  getPlayingEp(): ComputedRef<IPlayingEp> {
    return computed(() => this.state.playingEp);
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
