import Button from '../../src/elements/Button';
import ButtonTemplate from '../../src/templates/ButtonTemplate';
import { TEXT_LIMIT } from '../../src/constants';

describe('ButtonTemplate', () => {
  describe('new', () => {
    let button;
    beforeEach(() => {
      button = new Button({
        type: 'web_url',
        title: 'Button',
        url: 'http://www.example.com',
      });
    });

    it('returns valid object', () => {
      const text = 'Hello user!';
      const buttons = [button];
      const template = new ButtonTemplate({ text, buttons });
      expect(template).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Hello user!',
            buttons: [
              {
                type: 'web_url',
                title: 'Button',
                url: 'http://www.example.com',
              },
            ],
          },
        },
      });
    });

    it('checks that buttons is an array', () => {
      const text = 'Hello user!';
      const buttons = button;
      expect(() => {
        new ButtonTemplate({ text, buttons });
      }).toThrow('buttons must be an array.');
    });

    it('errors if text is too long', () => {
      const text = 'x'.repeat(TEXT_LIMIT + 1);
      const buttons = [button];
      expect(() => {
        new ButtonTemplate({ text, buttons });
      }).toThrow(`Text cannot be longer ${TEXT_LIMIT} characters.`);
    });
  });
});
