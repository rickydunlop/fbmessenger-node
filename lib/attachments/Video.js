import BaseAttachment from './BaseAttachment';

class Video extends BaseAttachment {
  constructor(url) {
    super('video', url);
  }
}

export default Video;
