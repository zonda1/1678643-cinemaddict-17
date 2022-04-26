import {createElement} from '../render.js';

const createNewFilterTemplate = () => '<section class="films-list"></section>';

export class NewFilmsListSectionView {
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
