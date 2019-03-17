const processErrorsInResponse = (response) => {
  if ({}.hasOwnProperty.call(response, 'data.error')) {
    switch (response.error.code) {
      case 4:
        if (response.error.subcode === 2018022) {
          throw new Error('Too many send requests to phone numbers.');
        }
        break;
      case 1200:
        throw new Error('Temporary send message failure. Please try again later.');
      case 613:
        throw new Error('Calls to this API have exceeded the rate limit.');
      case 100:
        switch (response.error.subcode) {
          case 2018109:
            throw new Error('Attachment size exceeds allowable limit.');
          case 2018001:
            throw new Error('No matching user found.');
          case 2018034:
            throw new Error('Message cannot be empty.');
          default:
            throw new Error(response.error.message);
        }
      case 10:
        switch (response.error.subcode) {
          case 2018065:
            throw new Error('This message is sent outside of allowed window. You need page_messaging_subscriptions permission to be able to do it.');
          case 2018108:
          default:
            throw new Error('This Person Cannot Receive Messages: This person isn\'t receiving messages from you right now.');
        }
      case 200:
        switch (response.error.subcode) {
          case 2018028:
            throw new Error('Cannot message users who are not admins, developers or testers of the app until pages_messaging permission is reviewed and the app is live.');
          case 2018027:
            throw new Error('Cannot message users who are not admins, developers or testers of the app until pages_messaging_phone_number permission is reviewed and the app is live.');
          case 2018021:
            throw new Error('Requires phone matching access fee to be paid by this page unless the recipient user is an admin, developer, or tester of the app.');
          default:
            throw new Error(response.error.message || 'Unknown error occurred.');
        }
      case 190:
        throw new Error('Invalid OAuth access token.');
      case 10303:
        throw new Error('Invalid account_linking_token.');
      default:
        throw new Error(response.error.message || 'Unknown error occurred.');
    }
  }
  return response.data;
};


export default processErrorsInResponse;
