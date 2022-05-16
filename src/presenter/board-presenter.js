import {NewFilterView} from '../view/new-filter-view.js';
import {NewSortView} from '../view/new-sort-view.js';
import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {render} from '../framework/render.js';
import {NoFeatureView} from '../view/no-feature-view';
import FilmPresenter from './film-presenter';

const TASK_COUNT_PER_STEP = 5;

const siteMainElement=document.querySelector('.main');

export class BoardPresenter {
  #boardContainer=null;
  #featureModel=null;
  #boardFeatures=[];
  filmsSection = new NewFilmsSectionView();
  filmsListSection = new NewFilmsListSectionView();
  filmsListContainer = new NewFilmsListContainerView();
  #loadMoreButtonComponent = new NewButtonView();

  #renderedFeatureCount = TASK_COUNT_PER_STEP;

  init = (boardContainer,featureModel) => {

    this.#boardContainer = boardContainer;
    this.#featureModel = featureModel;
    this.#boardFeatures = [...this.#featureModel.features];

    if (this.#boardFeatures.every((film)=>film.isArchive)) {
      render(this.filmsSection, this.#boardContainer);
      render(this.filmsListSection, this.filmsSection.element);
      render(new NoFeatureView(),this.filmsListSection.element);
    }
    else {
      render(new NewFilterView(), siteMainElement);
      render(new NewSortView(), siteMainElement);
      render(this.filmsSection, this.#boardContainer);
      render(this.filmsListSection, this.filmsSection.element);
      render(this.filmsListContainer, this.filmsListSection.element);
    }
    this.#renderFeatureList();
  };

  #renderFeatureList = () => {
    this.#renderFeatures(0, Math.min(this.#boardFeatures.length, TASK_COUNT_PER_STEP));
    if (this.#boardFeatures.length > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderFeatures = (from, to) => {
    this.#boardFeatures
      .slice(from, to)
      .forEach((task) => this.#renderFeature(task));
  };

  #renderFeature(task) {
    const filmPresenter = new FilmPresenter(this.filmsListContainer.element);
    filmPresenter.init(task,this.#featureModel,this.#boardFeatures);
  }

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.filmsListSection.element);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFeatures(this.#renderedFeatureCount, this.#renderedFeatureCount + TASK_COUNT_PER_STEP);
    this.#renderedFeatureCount += TASK_COUNT_PER_STEP;

    if (this.#renderedFeatureCount >= this.#boardFeatures.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };
}
