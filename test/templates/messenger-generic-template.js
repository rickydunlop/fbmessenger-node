import { expect } from 'chai';

import MessengerBubble from '../../lib/elements/messenger-bubble';
import MessengerButton from '../../lib/elements/messenger-button';
import MessengerGenericTemplate from '../../lib/templates/messenger-generic-template';

describe('MessengerGenericTemplate', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const template = new MessengerGenericTemplate([
        new MessengerBubble({
          title: 'Title',
          item_url: 'http://www.example.com',
          image_url: 'http://www.example.com',
          subtitle: 'Subtitle',
          buttons: [
            new MessengerButton({ title: 'Button', url: 'http://www.example.com' })
          ]
        })
      ]);

      expect(template).to.deep.equal({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
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
              }
            ]
          }
        }
      })
    });
  });
});
