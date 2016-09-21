import BaseAttachment from './BaseAttachment';

class File extends BaseAttachment {
  constructor(url, is_reusable = false) {
    super('file', url, is_reusable);
  }
}

export default File;
