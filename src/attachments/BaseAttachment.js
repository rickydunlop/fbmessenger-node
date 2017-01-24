class BaseAttachment {
  constructor({ type, url, is_reusable, attachment_id }) {
    this.type = type;
    this.url = url;
    this.is_reusable = is_reusable;
    this.attachment_id = attachment_id;

    const payload = {};

    if (this.url) {
      payload.url = url;
    }

    if (this.is_reusable) {
      payload.is_reusable = is_reusable;
    }

    if (this.attachment_id) {
      payload.attachment_id = attachment_id;
    }

    return {
      attachment: {
        type: this.type,
        payload,
      },
    };
  }
}

export default BaseAttachment;
