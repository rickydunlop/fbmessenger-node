import { expect } from 'chai';

import Element from '../../lib/elements/Element';
import Button from '../../lib/elements/Button';
import GenericTemplate from '../../lib/templates/GenericTemplate';

describe('GenericTemplate', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const template = new GenericTemplate([
        new Element({
          title: 'Title',
          item_url: 'http://www.example.com',
          image_url: 'http://www.example.com',
          subtitle: 'Subtitle',
          buttons: [
            new Button({
              type: 'web_url',
              title: 'Button',
              url: 'http://www.example.com',
            }),
          ],
        }),
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
                    url: 'http://www.example.com',
                  },
                ],
              },
            ],
          },
        },
      });
    });
  });
});
