import {generateFilmFeature} from '../mock/feature.js';
import {generateFilmComments} from '../mock/feature.js';

export class FeatureModel {
  features = Array.from({length: 10}, generateFilmFeature);
  comments = Array.from({length: 10}, generateFilmComments);

  getComments = () => this.comments;
  getFeatures = () => this.features;
}
// export class CommentModel {

// }
