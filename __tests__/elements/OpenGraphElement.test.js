import OpenGraphElement from '../../src/elements/OpenGraphElement';
import { OPEN_GRAPH_MAX_BUTTONS } from '../../src/constants';

describe('OpenGraphElement', () => {
  describe('new', () => {
    it('returns valid object', () => {
      const oge = new OpenGraphElement({
        url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
        buttons: [
          {
            type: 'web_url',
            url: 'https://en.wikipedia.org/wiki/Rickrolling',
            title: 'View More',
          },
        ],
      });
      expect(oge).toEqual(expect.objectContaining({
        url: expect.any(String),
        buttons: [
          expect.objectContaining({
            type: expect.any(String),
            title: expect.any(String),
            url: expect.any(String),
          }),
        ],
      }));
    });
    it('works without buttons', () => {
      const oge = new OpenGraphElement({
        url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
      });
      expect(oge).toEqual(expect.objectContaining({
        url: expect.any(String),
      }));
    });
  });

  describe('length check', () => {
    it('throws an error when too long', () => {
      expect(() => {
        new OpenGraphElement({
          url: 'https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb',
          buttons: Array(OPEN_GRAPH_MAX_BUTTONS + 1).fill({ type: 'test', title: 'test', url: 'test' }),
        });
      }).toThrow(`Open graph templates sent via the Send API support a maximum of ${OPEN_GRAPH_MAX_BUTTONS} buttons of any type.`);
    });
  });
});
