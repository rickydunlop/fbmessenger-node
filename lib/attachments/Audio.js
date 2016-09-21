import BaseAttachment from './BaseAttachment';

class Audio extends BaseAttachment {
  constructor(url, is_reusable = false) {
    super('audio', url, is_reusable);
  }
}

export default Audio;
