import { expect } from 'chai';

import Element from '../../lib/elements/Element';
import Button from '../../lib/elements/Button';
import BaseTemplate from '../../lib/templates/BaseTemplate';

describe('BaseTemplate', () => {
  describe('new', () => {
    it('validates elements is an array', () => {
      expect(() => {
        const template = new BaseTemplate(new Element({
          title: 'Title',
          item_url: 'http://www.example.com',
          image_url: 'http://www.example.com',
          subtitle: 'Subtitle',
          buttons: [
            new Button({
              type: 'web_url',
              title: 'Button',
              url: 'http://www.example.com'
            })
          ]
        })
      );
      }).to.throw('elements must be an array.');

    });

    it('validates element length', () => {
      let element = new Element({
        title: 'Title',
        item_url: 'http://www.example.com',
        image_url: 'http://www.example.com',
        subtitle: 'Subtitle',
        buttons: [
          new Button({
            type: 'web_url',
            title: 'Button',
            url: 'http://www.example.com'
          })
        ]
      });
      expect(() => {
        let elements = new Array(11);
        const template = new BaseTemplate(elements.fill(element, 0, 11));
      }).to.throw('You cannot have more than 10 elements in the template.');

    });
  });
});
