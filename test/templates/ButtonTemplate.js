import { expect } from 'chai';

import Button from '../../lib/elements/Button';
import ButtonTemplate from '../../lib/templates/ButtonTemplate';

describe('ButtonTemplate', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const template = new ButtonTemplate(
        'Hello user!',
        [
          new Button({
            type: 'web_url',
            title: 'Button',
            url: 'http://www.example.com'
          })
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

    it('checks that buttons is an array', () => {
      expect(() => {
        const template = new ButtonTemplate(
          'Hello user!',
          new Button({
            type: 'web_url',
            title: 'Button',
            url: 'http://www.example.com'
          })
        );
      }).to.throw('buttons must be an array.');
    });

  });
});
