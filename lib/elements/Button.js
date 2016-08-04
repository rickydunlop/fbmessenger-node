class Button {
  constructor({type, title, url='', payload=''}) {
    let button_types = [
      'web_url',
      'postback',
      'phone_number',
      'account_link',
      'account_unlink'
    ];

    if (button_types.indexOf(type) === -1) {
      throw 'Invalid button type provided.';
    }

    if (title.length > 20) {
      throw 'Title cannot be longer 20 characters.';
    }

    this.type = type;
    this.title = title;
    this.url = url;
    this.payload = payload;

    let button = {
      'type': this.type,
      'title': this.title
    };

    if (this.url) {
      button['url'] = this.url;
    }

    if (this.payload) {
      button['payload'] = this.payload;
    }

    return button;
  }

}

export default Button;
