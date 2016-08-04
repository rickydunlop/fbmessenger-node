import BaseAttachment from './BaseAttachment';

class File extends BaseAttachment {
  constructor(url) {
    super('file', url);
  }
}

export default File;
