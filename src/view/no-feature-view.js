import AbstractView from '../framework/view/abstract-view.js';

const createNoFeatureTemplate = () => (
  // eslint-disable-next-line quotes
  `<h2 class="films-list__title">There are no movies in our database</h2>`
);

export class NoFeatureView extends AbstractView {
  get template() {
    return createNoFeatureTemplate();
  }
}
