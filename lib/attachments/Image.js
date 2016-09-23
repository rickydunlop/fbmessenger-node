import BaseAttachment from './BaseAttachment';

class Image extends BaseAttachment {
  constructor({ url = false, is_reusable = false, attachment_id = '' }) {
    super({
      type: 'image',
      url,
      is_reusable,
      attachment_id,
    });
  }
}

export default Image;
