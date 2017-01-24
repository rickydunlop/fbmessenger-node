import BaseAttachment from './BaseAttachment';

class File extends BaseAttachment {
  constructor({ url = false, is_reusable = false, attachment_id = '' }) {
    super({
      type: 'file',
      url,
      is_reusable,
      attachment_id,
    });
  }
}

export default File;
