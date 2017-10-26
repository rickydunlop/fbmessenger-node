import Button from '../../src/elements/Button';
import Element from '../../src/elements/Element';

describe('Element', () => {
  describe('new', () => {
    it('returns valid object', () => {
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

      expect(element).toEqual({
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
      });
    });
  });

  describe('properties', () => {
    it('accepts just title', () => {
      const element = new Element({
        title: 'Title',
      });

      expect(element).toEqual({
        title: 'Title',
        image_url: '',
        subtitle: '',
      });
    });
  });
});
