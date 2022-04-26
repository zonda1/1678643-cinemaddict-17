import {createElement} from '../render.js';

const createNewFilterTemplate = () => '<section class="films"></section>';

export class NewFilmsSectionView {
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
