import { OPEN_GRAPH_MAX_BUTTONS } from '../constants';

class OpenGraphElement {
  constructor({ url, buttons = [] }) {
    this.url = url;
    this.buttons = buttons;

    const res = {
      url: this.url,
    };

    if (this.buttons.length) {
      if (this.buttons.length > OPEN_GRAPH_MAX_BUTTONS) {
        throw new Error(`Open graph templates sent via the Send API support a maximum of ${OPEN_GRAPH_MAX_BUTTONS} buttons of any type.`);
      }
      res.buttons = this.buttons;
    }

    return res;
  }
}

export default OpenGraphElement;
