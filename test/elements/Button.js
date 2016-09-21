import { expect } from 'chai';

import Button from '../../lib/elements/Button';

describe('Button', () => {
  describe('new', () => {
    describe('with type of web_url', () => {
      it('returns valid object', () => {
        const button = new Button({
          type: 'web_url',
          url: 'http://www.example.com',
          title: 'Example Title',
        });

        expect(button).to.deep.equal({
          type: 'web_url',
          url: 'http://www.example.com',
          title: 'Example Title',
        });
      });
    });

    describe('with type of postback', () => {
      it('returns valid object', () => {
        const button = new Button({
          type: 'postback',
          title: 'Example Title',
          payload: 'EXAMPLE',
        });

        expect(button).to.deep.equal({
          type: 'postback',
          title: 'Example Title',
          payload: 'EXAMPLE',
        });
      });
    });

    describe('with webview', () => {
      it('returns valid object', () => {
        const button = new Button({
          type: 'postback',
          title: 'Example Title',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
        });

        expect(button).to.deep.equal({
          type: 'postback',
          title: 'Example Title',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
        });
      });
    });

    describe('with messenger extensions enabled', () => {
      it('returns valid object', () => {
        const button = new Button({
          type: 'postback',
          title: 'Example Title',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          messenger_extensions: true,
        });

        expect(button).to.deep.equal({
          type: 'postback',
          title: 'Example Title',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          messenger_extensions: 'true',
        });
      });
    });

    describe('with fallback url', () => {
      it('returns valid object', () => {
        const button = new Button({
          type: 'postback',
          title: 'Example Title',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          fallback_url: 'https://facebook.com',
        });

        expect(button).to.deep.equal({
          type: 'postback',
          title: 'Example Title',
          url: 'https://facebook.com',
          webview_height_ratio: 'tall',
          fallback_url: 'https://facebook.com',
        });
      });
    });
  });

  describe('errors', () => {
    describe('title length', () => {
      it('throws error', () => {
        expect(() => {
          new Button({
            type: 'web_url',
            title: 'This title is too long and will throw an error',
            url: 'https://example.com',
          });
        }).to.throw('Title cannot be longer 20 characters.');
      });
    });

    describe('button type', () => {
      it('throws error', () => {
        expect(() => {
          new Button({
            type: 'wrong',
            title: 'Example Title',
            url: 'https://example.com',
          });
        }).to.throw('Invalid button type provided.');
      });
    });

    describe('webview height ratio', () => {
      it('throws error', () => {
        expect(() => {
          new Button({
            type: 'web_url',
            title: 'Example Title',
            url: 'https://example.com',
            webview_height_ratio: 'wrong',
          });
        }).to.throw('Invalid webview_height_ratio provided.');
      });
    });
  });
});
