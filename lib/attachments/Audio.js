import BaseAttachment from './BaseAttachment';

class Audio extends BaseAttachment {
  constructor(url) {
    super('audio', url);
  }
}

export default Audio;
