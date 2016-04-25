class MessengerGenericTemplate {
  constructor(elements) {
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: elements
        }
      }
    };
  }
}

export default MessengerGenericTemplate;
