import BaseAttachment from './BaseAttachment';

class Video extends BaseAttachment {
  constructor(url, is_reusable = false) {
    super('video', url, is_reusable);
  }
}

export default Video;
