class MessengerImage {
  constructor(url) {
    return {
      attachment: {
        type: 'image',
        payload: {
          url: url
        }
      }
    };
  }
}

export default MessengerImage;
