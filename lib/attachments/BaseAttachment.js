class BaseAttachment {
  constructor(type, url, is_reusable) {
    this.type = type;
    this.url = url;
    this.is_reusable = is_reusable;

    return {
      attachment: {
        type: this.type,
        payload: {
          url: this.url,
          is_reusable: this.is_reusable,
        },
      },
    };
  }
}

export default BaseAttachment;
