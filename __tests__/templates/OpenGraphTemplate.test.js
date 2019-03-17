import OpenGraphElement from '../../src/elements/OpenGraphElement';
import Button from '../../src/elements/Button';
import OpenGraphTemplate from '../../src/templates/OpenGraphTemplate';

const button = new Button({
  type: 'web_url',
  url: 'https://en.wikipedia.org/wiki/Rickrolling',
  title: 'View More',
});

const openGraphElement = new OpenGraphElement({
  url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
  buttons: [button],
});

const elements = [openGraphElement];

describe('OpenGraphTemplate', () => {
  describe('new', () => {
    it('returns a valid object', () => {
      const template = new OpenGraphTemplate({ elements });

      expect(template).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'open_graph',
            elements: [
              {
                url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
                buttons: [
                  {
                    type: 'web_url',
                    url: 'https://en.wikipedia.org/wiki/Rickrolling',
                    title: 'View More',
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
