import Button from '../../src/elements/Button';
import Element from '../../src/elements/Element';
import DefaultAction from '../../src/elements/DefaultAction';
import ListTemplate from '../../src/templates/ListTemplate';

describe('ListTemplate', () => {
  describe('new', () => {
    it('returns correct object', () => {
      const template = new ListTemplate({
        elements: Array(2).fill(
          new Element({
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
          }),
        ),
      });

      expect(template).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'list',
            top_element_style: 'large',
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
            elements: [
              new Element({
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
              }),
            ],
          });
        }).toThrow('You must have more than 2 elements in the template.');
      });
    });

    describe('with too many elements', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            elements: Array(5).fill(
              new Element({
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
              }),
            ),
          });
        }).toThrow('You cannot have more than 4 elements in the template.');
      });
    });

    describe('invalid element type', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            elements: 'invalid'
          });
        }).toThrow('elements must be an array.');
      });
    });

    describe('Invalid top_element_style', () => {
      it('will throw an error', () => {
        expect(() => {
          new ListTemplate({
            top_element_style: 'invalid',
            elements: [
              new Element({
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
              }),
              new Element({
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
              }),
            ],
          });
        }).toThrow('Invalid top_element_style provided.');
      });
    });
  });
});
