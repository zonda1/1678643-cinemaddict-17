import AbstractView from '../framework/view/abstract-view.js';

const createNewFilterTemplate = () => '<section class="films"></section>';

export class NewFilmsSectionView extends AbstractView {

  get template() {
    return createNewFilterTemplate();
  }

}
