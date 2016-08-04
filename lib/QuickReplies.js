class QuickReply {
  constructor(title, payload) {
    if (title.length > 20) {
      throw 'Title cannot be longer 20 characters.';
    }

    if (payload.length > 1000) {
      throw 'Payload cannot be longer 1000 characters.';
    }

    this.title = title;
    this.payload = payload;

    return {
      'content_type': 'text',
      'title': this.title,
      'payload': this.payload
    };

  }
}

class QuickReplies {
  constructor(quick_replies = []) {

    if (!Array.isArray(quick_replies)) {
      throw 'You must pass an array of QuickReply objects.';
    }

    if (quick_replies.length > 10) {
      throw 'You cannot have more than 10 quick replies.';
    }

    this.quick_replies = quick_replies;

    return {
      'quick_replies': this.quick_replies.map(el => el.obj)
    };

  }
}

export {
  QuickReply,
  QuickReplies
};
