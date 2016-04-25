import { expect } from 'chai';

import MessengerButton from '../../lib/elements/messenger-button';
import MessengerBubble from '../../lib/elements/messenger-bubble';

describe('MessengerButton', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const bubble = new MessengerBubble({
        title: 'Title',
        item_url: 'http://www.example.com',
        image_url: 'http://www.example.com',
        subtitle: 'Subtitle',
        buttons: [
          new MessengerButton({ title: 'Button', url: 'http://www.example.com' })
        ]
      });

      expect(bubble).to.deep.equal({
        title: 'Title',
        item_url: 'http://www.example.com',
        image_url: 'http://www.example.com',
        subtitle: 'Subtitle',
        buttons: [
          {
            type: 'web_url',
            title: 'Button',
            url: 'http://www.example.com'
          }
        ]
      });
    });
  });
});
