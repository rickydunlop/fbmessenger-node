import { expect } from 'chai';

import Button from '../../lib/elements/Button';
import Element from '../../lib/elements/Element';

describe('Element', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const element = new Element({
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

      expect(element).to.deep.equal({
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

  describe('properties', () => {
    it('accepts just title', () => {
      const element = new Element({
        title: 'Title'
      });

      expect(element).to.deep.equal({
        title: 'Title',
        item_url: '',
        image_url: '',
        subtitle: '',
        buttons: []
      });
    });

  });
});
