import {createElement} from '../render.js';

const createNewFilterTemplate = () => '<section class="films"></section>';

export class NewFilmsSectionView {
  #element=null;

  get template() {
    return createNewFilterTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
