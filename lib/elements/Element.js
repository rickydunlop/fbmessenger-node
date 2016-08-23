class Element {
  constructor({ title, item_url = '', image_url = '', subtitle = '', buttons = [] }) {
    this.title = title;
    this.item_url = item_url;
    this.image_url = image_url;
    this.subtitle = subtitle;
    this.buttons = buttons;

    return {
      title: this.title,
      item_url: this.item_url,
      image_url: this.image_url,
      subtitle: this.subtitle,
      buttons: this.buttons,
    };
  }
}

export default Element;
