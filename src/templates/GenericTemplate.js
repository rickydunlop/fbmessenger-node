import BaseTemplate from './BaseTemplate';
import { IMAGE_ASPECT_RATIO_TYPES } from '../constants';

class GenericTemplate extends BaseTemplate {
  constructor({ elements, image_aspect_ratio = 'horizontal', sharable = true }) {
    super(elements);

    if (IMAGE_ASPECT_RATIO_TYPES.indexOf(image_aspect_ratio) === -1) {
      throw new Error('Invalid image aspect ratio type provided.');
    }

    this.image_aspect_ratio = image_aspect_ratio;
    this.sharable = sharable;

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          sharable: this.sharable,
          image_aspect_ratio: this.image_aspect_ratio,
          elements: this.elements,
        },
      },
    };
  }
}

export default GenericTemplate;
