import Element from '../../src/elements/Element';
import Button from '../../src/elements/Button';
import GenericTemplate from '../../src/templates/GenericTemplate';

const elements = [
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
];

describe('GenericTemplate', () => {
  describe('new', () => {
    it('returns a valid object', () => {
      const template = new GenericTemplate({ elements });

      expect(template).toEqual({
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
            image_aspect_ratio: 'horizontal',
            sharable: true,
          },
        },
      });
    });
  });

  describe('errors', () => {
    describe('instantiation with incorrect image aspect ratio', () => {
      it('throws an error', () => {
        expect(() => {
          new GenericTemplate({
            elements,
            image_aspect_ratio: 'long',
          });
        }).toThrow('Invalid image aspect ratio type provided.');
      });
    });
  });
});
