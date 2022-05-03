import {createElement} from '../render.js';

const createNewFilterTemplate = () => '<div class="films-list__container"></div>';

export class NewFilmsListContainerView {
  getTemplate() {
    return createNewFilterTemplate();
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
