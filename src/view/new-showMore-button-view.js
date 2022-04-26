import {createElement} from '../render.js';

const createNewButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export class NewButtonView {
  getTemplate() {
    return createNewButtonTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
