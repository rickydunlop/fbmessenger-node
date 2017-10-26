import BaseTemplate from './BaseTemplate';
import { IMAGE_ASPECT_RATIO_TYPES } from '../constants';

class GenericTemplate extends BaseTemplate {
  constructor({ elements, image_aspect_ratio = 'horizontal', sharable = true }) {
    super(elements);

    if (IMAGE_ASPECT_RATIO_TYPES.indexOf(image_aspect_ratio) === -1) {
      throw new Error('Invalid image aspect ratio type provided.');
    }

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          sharable,
          image_aspect_ratio,
          elements,
        },
      },
    };
  }
}

export default GenericTemplate;
