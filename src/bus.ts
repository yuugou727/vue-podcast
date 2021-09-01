import mitt from 'mitt';

type Events = {
  request: {
    title: string;
    guid: string;
    type: string;
    url: string;
  },
  playEnd: {
    guid: string
  },
};

export default mitt<Events>();