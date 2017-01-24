import Element from '../../src/elements/Element';
import Button from '../../src/elements/Button';
import BaseTemplate from '../../src/templates/BaseTemplate';

describe('BaseTemplate', () => {
  describe('new', () => {
    it('validates elements is an array', () => {
      expect(() => {
        new BaseTemplate(new Element({
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
        }));
      }).toThrow('elements must be an array.');
    });

    it('validates element length', () => {
      const element = new Element({
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
      });
      expect(() => {
        const elements = new Array(11);
        new BaseTemplate(elements.fill(element, 0, 11));
      }).toThrow('You cannot have more than 10 elements in the template.');
    });
  });
});
