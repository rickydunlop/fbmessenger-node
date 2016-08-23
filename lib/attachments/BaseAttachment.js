class BaseAttachment {
  constructor(type, url) {
    this.type = type;
    this.url = url;

    return {
      attachment: {
        type: this.type,
        payload: {
          url: this.url,
        },
      },
    };
  }
}

export default BaseAttachment;
