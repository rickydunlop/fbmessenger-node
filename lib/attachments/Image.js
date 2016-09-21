import BaseAttachment from './BaseAttachment';

class Image extends BaseAttachment {
  constructor(url, is_reusable = false) {
    super('image', url, is_reusable);
  }
}

export default Image;
