import {generateFilmFeature} from '../mock/feature.js';

export class FeatureModel {
  features = Array.from({length: 10}, generateFilmFeature);

  getFeatures = () => this.features;
}
