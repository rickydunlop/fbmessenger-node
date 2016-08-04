class SenderAction {
  constructor(sender_action) {
    let actions = [
      'mark_seen',
      'typing_on',
      'typing_off'
    ];

    if (actions.indexOf(sender_action) === -1) {
      throw 'Invalid sender_action provided.';
    }

    return this.sender_action;
  }

}

export default SenderAction;
