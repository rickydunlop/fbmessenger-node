class Button {
  constructor({
    type,
    title,
    url = '',
    payload = '',
    webview_height_ratio = '',
    messenger_extensions = '',
    fallback_url = '',
  }) {
    const buttonTypes = [
      'web_url',
      'postback',
      'phone_number',
      'account_link',
      'account_unlink',
      'element_share',
    ];

    const webviewHeightRatios = [
      'compact',
      'tall',
      'full',
    ];


    if (buttonTypes.indexOf(type) === -1) {
      throw new Error('Invalid button type provided.');
    }

    if (webview_height_ratio && webviewHeightRatios.indexOf(webview_height_ratio) === -1) {
      throw new Error('Invalid webview_height_ratio provided.');
    }

    if (title.length > 20) {
      throw new Error('Title cannot be longer 20 characters.');
    }

    this.type = type;
    this.title = title;
    this.url = url;
    this.payload = payload;
    this.webview_height_ratio = webview_height_ratio;
    this.messenger_extensions = messenger_extensions;
    this.fallback_url = fallback_url;

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

    if (this.webview_height_ratio) {
      button.webview_height_ratio = this.webview_height_ratio;
    }

    if (this.messenger_extensions) {
      button.messenger_extensions = 'true';
    }

    if (this.fallback_url) {
      button.fallback_url = this.fallback_url;
    }

    return button;
  }
}

export default Button;
