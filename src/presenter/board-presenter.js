import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {NewFilmCardView} from '../view/new-film-card-view.js';
import {render} from '../render.js';

export class BoardPresenter {
  filmsSection = new NewFilmsSectionView();
  filmsListSection = new NewFilmsListSectionView();
  filmsListContainer = new NewFilmsListContainerView();

  init = (boardContainer,featureModel) => {
    this.boardContainer = boardContainer;
    this.featureModel = featureModel;
    this.boardFeatures = [...this.featureModel.getFeatures()];

    render(this.filmsSection, this.boardContainer);
    render(this.filmsListSection, this.filmsSection.getElement());
    render(this.filmsListContainer, this.filmsListSection.getElement());

    for (let i = 0; i < this.boardFeatures.length; i++) {
      render(new NewFilmCardView(this.boardFeatures[i]), this.filmsListContainer.getElement());
    }

    render(new NewButtonView(), this.filmsListSection.getElement());
  };
}
