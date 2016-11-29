import Button from './Button';

class DefaultAction extends Button {
  constructor({
    url,
    payload = '',
    webview_height_ratio = '',
    messenger_extensions = '',
    fallback_url = '',
  }) {
    const obj = super({
      type: 'web_url',
      title: '',
      url,
      payload,
      webview_height_ratio,
      messenger_extensions,
      fallback_url,
    });

    delete obj.title;

    return obj;
  }
}

export default DefaultAction;
