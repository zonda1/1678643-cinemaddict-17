import {createElement} from '../render.js';

const createNewButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export class NewButtonView {
  #element=null;

  get template() {
    return createNewButtonTemplate();
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
