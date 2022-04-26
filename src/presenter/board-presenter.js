import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-filmsList-section-view';
import {NewFilmsListContainerView} from '../view/new-filmsContainer-view';
// import TaskView from '../view/task-view.js';
// import TaskEditView from '../view/task-edit-view.js';
import {NewButtonView} from '../view/new-showMore-button-view.js';
import {NewFilmCardView} from '../view/new-film-card-view.js';
// import {NewPopupView} from '../view/new-popup-view.js';
import {render} from '../render.js';

export class BoardPresenter {
  filmsSection = new NewFilmsSectionView();
  filmsListSection = new NewFilmsListSectionView();
  filmsListContainer = new NewFilmsListContainerView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(this.filmsSection, this.boardContainer);
    render(this.filmsListSection, this.filmsSection.getElement());
    render(this.filmsListContainer, this.filmsListSection.getElement());

    for (let i = 0; i < 5; i++) {
      render(new NewFilmCardView(), this.filmsListContainer.getElement());
    }

    render(new NewButtonView(), this.filmsListSection.getElement());
  };
}
