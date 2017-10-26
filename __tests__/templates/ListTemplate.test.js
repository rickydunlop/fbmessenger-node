import Button from '../../src/elements/Button';
import Element from '../../src/elements/Element';
import DefaultAction from '../../src/elements/DefaultAction';
import ListTemplate from '../../src/templates/ListTemplate';
import {
  LIST_TEMPLATE_MIN_ELEMENTS,
  LIST_TEMPLATE_MAX_ELEMENTS,
  LIST_TEMPLATE_MAX_BUTTONS,
} from '../../src/constants';

const element = new Element({
  title: 'Title',
  item_url: 'http://www.example.com',
  image_url: 'http://www.example.com',
  subtitle: 'Subtitle',
  default_action: new DefaultAction({
    url: 'http://www.example.com',
  }),
  buttons: [
    new Button({
      type: 'web_url',
      title: 'Button',
      url: 'http://www.example.com',
    }),
  ],
});

describe('ListTemplate', () => {
  describe('new', () => {
    it('returns correct object', () => {
      const template = new ListTemplate({
        elements: Array(2).fill(element),
      });

      expect(template).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'list',
            top_element_style: 'large',
            sharable: true,
            buttons: [],
            elements: [
              {
                title: 'Title',
                item_url: 'http://www.example.com',
                image_url: 'http://www.example.com',
                subtitle: 'Subtitle',
                default_action: {
                  type: 'web_url',
                  url: 'http://www.example.com',
                },
                buttons: [
                  {
                    type: 'web_url',
                    title: 'Button',
                    url: 'http://www.example.com',
                  },
                ],
              },
              {
                title: 'Title',
                item_url: 'http://www.example.com',
                image_url: 'http://www.example.com',
                subtitle: 'Subtitle',
                default_action: {
                  type: 'web_url',
                  url: 'http://www.example.com',
                },
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

  describe('errors', () => {
    describe('less than 2 elements', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            elements: [element],
          });
        }).toThrow(`You must have more than ${LIST_TEMPLATE_MIN_ELEMENTS} elements.`);
      });
    });

    describe('with too many elements', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            elements: Array(5).fill(element),
          });
        }).toThrow(`You cannot have more than ${LIST_TEMPLATE_MAX_ELEMENTS} elements.`);
      });
    });

    describe('with too many buttons', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            elements: Array(2).fill(element),
            buttons: Array(LIST_TEMPLATE_MAX_BUTTONS + 1).fill('x'),
          });
        }).toThrow(`You can have a maximum of ${LIST_TEMPLATE_MAX_BUTTONS} button`);
      });
    });

    describe('invalid element type', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            elements: 'invalid',
          });
        }).toThrow('elements must be an array.');
      });
    });

    describe('Invalid top_element_style', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            top_element_style: 'invalid',
            elements: [element, element],
          });
        }).toThrow('Invalid top_element_style provided.');
      });
    });
  });
});
