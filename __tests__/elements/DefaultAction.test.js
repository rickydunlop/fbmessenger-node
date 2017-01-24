import DefaultAction from '../../src/elements/DefaultAction';

describe('DefaultAction', () => {
  describe('new', () => {
    describe('with type of web_url', () => {
      it('returns valid object', () => {
        const da = new DefaultAction({
          url: 'http://www.example.com',
        });

        expect(da).toEqual({
          type: 'web_url',
          url: 'http://www.example.com',
        });
      });
    });

    describe('with webview', () => {
      it('returns valid object', () => {
        const da = new DefaultAction({
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
        });

        expect(da).toEqual({
          type: 'web_url',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
        });
      });
    });

    describe('with messenger extensions enabled', () => {
      it('returns valid object', () => {
        const da = new DefaultAction({
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          messenger_extensions: true,
        });

        expect(da).toEqual({
          type: 'web_url',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          messenger_extensions: 'true',
        });
      });
    });

    describe('with fallback url', () => {
      it('returns valid object', () => {
        const da = new DefaultAction({
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          fallback_url: 'https://facebook.com',
        });

        expect(da).toEqual({
          type: 'web_url',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          fallback_url: 'https://facebook.com',
        });
      });
    });
  });

  describe('errors', () => {
    describe('webview height ratio', () => {
      it('throws error', () => {
        expect(() => {
          new DefaultAction({
            url: 'https://example.com',
            webview_height_ratio: 'wrong',
          });
        }).toThrow('Invalid webview_height_ratio provided.');
      });
    });
  });
});
