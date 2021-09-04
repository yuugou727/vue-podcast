export type IFeed = {
  title: string;
  image: {
    link: string;
    title: string;
    url: string;
  };
  items: IEpisode[];
  [key: string]: any;
}

export interface IEpisode {
  guid: string;
  title: string;
  isoDate: string;
  content: string;
  itunes: {
    duration: string;
    episode: string;
    image: string;
    season: string;
    summary: string;
    [key: string]: string;
  };
  enclosure: {
    length: string;
    type: string;
    url: string;
  };
  [key: string]: any;
}
