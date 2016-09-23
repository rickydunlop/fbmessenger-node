class Element {
  constructor({
    title,
    item_url = '',
    image_url = '',
    subtitle = '',
    quantity = '',
    price = '',
    currency = '',
    buttons = [],
  }) {
    this.title = title;
    this.item_url = item_url;
    this.image_url = image_url;
    this.subtitle = subtitle;
    this.quantity = quantity;
    this.price = price;
    this.currency = currency;
    this.buttons = buttons;

    const res = {
      title: this.title,
      image_url: this.image_url,
      subtitle: this.subtitle,
    };

    if (this.item_url) {
      res.item_url = this.item_url;
    }

    if (this.quantity) {
      res.quantity = this.quantity;
    }

    if (this.currency) {
      res.currency = this.currency;
    }

    if (this.price) {
      res.price = this.price;
    }

    if (this.buttons.length) {
      res.buttons = this.buttons;
    }

    return res;
  }
}

export default Element;
