import {createElement} from '../render.js';

const createNewFilterTemplate = () => '<div class="films-list__container"></div>';

export class NewFilmsListContainerView {
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
