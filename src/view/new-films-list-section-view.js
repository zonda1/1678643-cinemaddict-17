import AbstractView from '../framework/view/abstract-view.js';

const createNewFilterTemplate = () => '<section class="films-list"></section>';

export class NewFilmsListSectionView extends AbstractView {

  get template() {
    return createNewFilterTemplate();
  }

}
