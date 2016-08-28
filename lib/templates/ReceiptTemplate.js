class ReceiptTemplate {
  constructor({ recipient_name, order_number, currency, payment_method,
                elements, summary, timestamp = '', order_url = '', address = '',
                adjustments = [] }) {
    this.recipient_name = recipient_name;
    this.order_number = order_number;
    this.currency = currency;
    this.payment_method = payment_method;
    this.elements = elements;
    this.summary = summary;
    this.timestamp = timestamp;
    this.order_url = order_url;
    this.address = address;
    this.adjustments = adjustments;

    const res = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'receipt',
          recipient_name: this.recipient_name,
          order_number: this.order_number,
          currency: this.currency,
          payment_method: this.payment_method,
          order_url: this.order_url,
          timestamp: this.timestamp,
          elements: this.elements,
          address: this.address,
          summary: this.summary,
        },
      },
    };

    if (this.adjustments) {
      res.attachment.payload.adjustments = this.adjustments;
    }

    return res;
  }
}

export default ReceiptTemplate;
