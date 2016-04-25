class MessengerReceiptTemplate {
  constructor(attrs) {
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'receipt',
          recipient_name: attrs.recipient_name,
          order_number: attrs.order_number,
          currency: attrs.currency,
          payment_method: attrs.payment_method,
          order_url: attrs.order_url,
          timestamp: attrs.timestamp,
          elements: attrs.elements,
          address: attrs.address,
          summary: attrs.summary,
          adjustments: attrs.adjustments
        }
      }
    };
  }
}

export default MessengerReceiptTemplate;
