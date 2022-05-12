import AbstractView from '../framework/view/abstract-view.js';

const createNewFilterTemplate = () => '<div class="films-list__container"></div>';

export class NewFilmsListContainerView extends AbstractView {

  get template() {
    return createNewFilterTemplate();
  }
}
