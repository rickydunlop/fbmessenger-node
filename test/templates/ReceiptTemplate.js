import { expect } from 'chai';

import Element from '../../lib/elements/Element';
import Button from '../../lib/elements/Button';
import Address from '../../lib/elements/Address';
import Summary from '../../lib/elements/Summary';
import Adjustment from '../../lib/elements/Adjustment';
import ReceiptTemplate from '../../lib/templates/ReceiptTemplate';

describe('ReceiptTemplate', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const template = new ReceiptTemplate({
        recipient_name: 'Name',
        order_number: '123',
        currency: 'USD',
        payment_method: 'Visa',
        order_url: 'http://www.example.com',
        timestamp: '123123123',
        elements: [
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
        ],
        address: new Address({
          street_1: '1 Hacker Way',
          street_2: '',
          city: 'Menlo Park',
          postal_code: '94025',
          state: 'CA',
          country: 'US',
        }),
        summary: new Summary({
          subtotal: 75.00,
          shipping_cost: 4.95,
          total_tax: 6.19,
          total_cost: 56.14,
        }),
        adjustments: [
          new Adjustment({
            name: 'Adjustment',
            amount: 20,
          }),
        ],
      });

      expect(template).to.deep.equal({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'receipt',
            recipient_name: 'Name',
            order_number: '123',
            currency: 'USD',
            payment_method: 'Visa',
            order_url: 'http://www.example.com',
            timestamp: '123123123',
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
            address: {
              street_1: '1 Hacker Way',
              street_2: '',
              city: 'Menlo Park',
              postal_code: '94025',
              state: 'CA',
              country: 'US',
            },
            summary: {
              subtotal: 75.00,
              shipping_cost: 4.95,
              total_tax: 6.19,
              total_cost: 56.14,
            },
            adjustments: [
              {
                name: 'Adjustment',
                amount: 20,
              },
            ],
          },
        },
      });
    });

    it('acepts minimum params', () => {
      const template = new ReceiptTemplate({
        recipient_name: 'Name',
        order_number: '123',
        currency: 'USD',
        payment_method: 'Visa',
        elements: [
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
        ],
        summary: new Summary({
          subtotal: 75.00,
          shipping_cost: 4.95,
          total_tax: 6.19,
          total_cost: 56.14,
        }),
      });

      expect(template).to.deep.equal({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'receipt',
            recipient_name: 'Name',
            order_number: '123',
            order_url: '',
            currency: 'USD',
            payment_method: 'Visa',
            timestamp: '',
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
            summary: {
              subtotal: 75.00,
              shipping_cost: 4.95,
              total_tax: 6.19,
              total_cost: 56.14,
            },
            address: '',
          },
        },
      });
    });
  });
});
