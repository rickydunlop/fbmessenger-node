import BaseAttachment from './BaseAttachment';

class Image extends BaseAttachment {
  constructor(url) {
    super('image', url);
  }
}

export default Image;
