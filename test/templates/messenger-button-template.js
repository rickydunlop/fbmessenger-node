import { expect } from 'chai';

import MessengerButton from '../../lib/elements/messenger-button';
import MessengerButtonTemplate from '../../lib/templates/messenger-button-template';

describe('MessengerButtonTemplate', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const template = new MessengerButtonTemplate(
        'Hello user!',
        [
          new MessengerButton({ title: 'Button', url: 'http://www.example.com' })
        ]
      );

      expect(template).to.deep.equal({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Hello user!',
            buttons: [
              {
                type: 'web_url',
                title: 'Button',
                url: 'http://www.example.com'
              }
            ]
          }
        }
      });
    });
  });
});
