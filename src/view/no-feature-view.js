import { FilterType } from '../const/const.js';
import AbstractView from '../framework/view/abstract-view.js';

const NoFeatureTextType={
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFeatureTemplate = (filterType) => {
  const noFeatureText=NoFeatureTextType[filterType];
  // eslint-disable-next-line quotes
  return (`<h2 class="films-list__title">${noFeatureText}</h2>`);
};

export class NoFeatureView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoFeatureTemplate(this.#filterType);
  }
}
