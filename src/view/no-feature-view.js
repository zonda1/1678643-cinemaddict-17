import {createElement} from '../render.js';

const createNoFeatureTemplate = () => (
  // eslint-disable-next-line quotes
  `<h2 class="films-list__title">There are no movies in our database</h2>`
);

export class NoFeatureView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoFeatureTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
