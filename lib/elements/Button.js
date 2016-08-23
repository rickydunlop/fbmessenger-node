class Button {
  constructor({ type, title, url = '', payload = '' }) {
    const buttonTypes = [
      'web_url',
      'postback',
      'phone_number',
      'account_link',
      'account_unlink',
    ];

    if (buttonTypes.indexOf(type) === -1) {
      throw new Error('Invalid button type provided.');
    }

    if (title.length > 20) {
      throw new Error('Title cannot be longer 20 characters.');
    }

    this.type = type;
    this.title = title;
    this.url = url;
    this.payload = payload;

    const button = {
      type: this.type,
      title: this.title,
    };

    if (this.url) {
      button.url = this.url;
    }

    if (this.payload) {
      button.payload = this.payload;
    }

    return button;
  }
}

export default Button;
