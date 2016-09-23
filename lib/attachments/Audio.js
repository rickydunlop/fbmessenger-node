import BaseAttachment from './BaseAttachment';

class Audio extends BaseAttachment {
  constructor({ url = false, is_reusable = false, attachment_id = '' }) {
    super({
      type: 'audio',
      url,
      is_reusable,
      attachment_id,
    });
  }
}

export default Audio;
