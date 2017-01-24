class ButtonTemplate {
  constructor({ text, buttons }) {
    this.text = text;

    if (!Array.isArray(buttons)) {
      throw new Error('buttons must be an array.');
    }

    this.buttons = buttons;

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: this.text,
          buttons: this.buttons,
        },
      },
    };
  }
}

export default ButtonTemplate;
