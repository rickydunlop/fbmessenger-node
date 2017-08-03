import OPEN_GRAPH_MAX_BUTTONS from '../constants';

class OpenGraphElement {
  constructor({ url, buttons = '' }) {
    this.url = url;
    this.buttons = buttons;

    const res = {
      url: this.url,
    };

    if (this.buttons) {
      if (this.buttons.length > OPEN_GRAPH_MAX_BUTTONS) {
        throw new Error(`Maximum of ${OPEN_GRAPH_MAX_BUTTONS} buttons are allowed when sending via Send API.`);
      }
      res.buttons = this.buttons;
    }

    return res;
  }
}

export default OpenGraphElement;
