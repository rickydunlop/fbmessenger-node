import BaseAttachment from './BaseAttachment';

class Video extends BaseAttachment {
  constructor({ url = false, is_reusable = false, attachment_id = '' }) {
    super({
      type: 'video',
      url,
      is_reusable,
      attachment_id,
    });
  }
}

export default Video;
