import AbstractView from '../framework/view/abstract-view.js';

const createNewButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export class NewButtonView extends AbstractView {

  get template() {
    return createNewButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

}
