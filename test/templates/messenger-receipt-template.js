import { expect } from 'chai';

import MessengerBubble from '../../lib/elements/messenger-bubble';
import MessengerButton from '../../lib/elements/messenger-button';
import MessengerAddress from '../../lib/elements/messenger-address';
import MessengerSummary from '../../lib/elements/messenger-summary';
import MessengerAdjustment from '../../lib/elements/messenger-adjustment';
import MessengerReceiptTemplate from '../../lib/templates/messenger-receipt-template';

describe('MessengerReceiptTemplate', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const template = new MessengerReceiptTemplate({
        recipient_name: 'Name',
        order_number: '123',
        currency: 'USD',
        payment_method: 'Visa',
        order_url: 'http://www.example.com',
        timestamp: '123123123',
        elements: [
          new MessengerBubble({
            title: 'Title',
            item_url: 'http://www.example.com',
            image_url: 'http://www.example.com',
            subtitle: 'Subtitle',
            buttons: [
              new MessengerButton({ title: 'Button', url: 'http://www.example.com' })
            ]
          })
        ],
        address: new MessengerAddress({
          street_1: '1 Hacker Way',
          street_2: '',
          city: 'Menlo Park',
          postal_code: '94025',
          state: 'CA',
          country: 'US'
        }),
        summary: new MessengerSummary({
          subtotal: 75.00,
          shipping_cost: 4.95,
          total_tax: 6.19,
          total_cost: 56.14
        }),
        adjustments: [
          new MessengerAdjustment('Adjustment', 20)
        ]
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
                    url: 'http://www.example.com'
                  }
                ]
              }
            ],
            address: {
              street_1: '1 Hacker Way',
              street_2: '',
              city: 'Menlo Park',
              postal_code: '94025',
              state: 'CA',
              country: 'US'
            },
            summary: {
              subtotal: 75.00,
              shipping_cost: 4.95,
              total_tax: 6.19,
              total_cost: 56.14
            },
            adjustments: [
              {
                name: 'Adjustment',
                amount: 20
              }
            ]
          }
        }
      });
    });
  });
});
