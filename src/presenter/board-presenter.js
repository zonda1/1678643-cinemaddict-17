import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {NewFilmCardView} from '../view/new-film-card-view.js';
import {render} from '../render.js';
import {NewPopupView} from '../view/new-popup-view.js';
export class BoardPresenter {
  #boardContainer=null;
  #featureModel=null;
  #boardFeatures=[];
  #popupFeatures=[];
  filmsSection = new NewFilmsSectionView();
  filmsListSection = new NewFilmsListSectionView();
  filmsListContainer = new NewFilmsListContainerView();

  #renderFeature(task) {
    const featureComponent= new NewFilmCardView(task);
    // const popupComponent=new NewPopupView();
    render(featureComponent, this.filmsListContainer.element);
    // render(popupComponent, siteBody);
  }

  init = (boardContainer,featureModel) => {

    this.#boardContainer = boardContainer;
    this.#featureModel = featureModel;
    this.#boardFeatures = [...this.#featureModel.features];

    render(this.filmsSection, this.#boardContainer);
    render(this.filmsListSection, this.filmsSection.element);
    render(this.filmsListContainer, this.filmsListSection.element);

    for (let i = 0; i < this.#boardFeatures.length; i++) {
      this.#renderFeature(this.#boardFeatures[i]);
    }

    render(new NewButtonView(), this.filmsListSection.element);
  };
}
