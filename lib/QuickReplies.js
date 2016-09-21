class QuickReply {
  constructor({ title, payload = '', content_type = 'text' }) {
    const contentTypes = [
      'text',
      'location',
    ];

    if (contentTypes.indexOf(content_type) === -1) {
      throw new Error('Invalid content type provided.');
    }

    if (title.length > 20) {
      throw new Error('Title cannot be longer 20 characters.');
    }

    if (payload && payload.length > 1000) {
      throw new Error('Payload cannot be longer 1000 characters.');
    }

    this.title = title;
    this.content_type = content_type;
    this.payload = payload;

    const quick_reply = {
      title: this.title,
      content_type: this.content_type,
    };

    if (this.payload && this.content_type === 'text') {
      quick_reply.payload = this.payload;
    }

    return quick_reply;
  }
}

class QuickReplies {
  constructor(quickReplies) {
    if (!Array.isArray(quickReplies)) {
      throw new Error('You must pass an array of QuickReply objects.');
    }

    if (quickReplies.length > 10) {
      throw new Error('You cannot have more than 10 quick replies.');
    }

    this.quickReplies = quickReplies;

    return {
      quick_replies: this.quickReplies,
    };
  }
}

export {
  QuickReply,
  QuickReplies,
};
