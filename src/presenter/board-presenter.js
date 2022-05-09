import {NewFilterView} from '../view/new-filter-view.js';
import {NewSortView} from '../view/new-sort-view.js';
import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {NewFilmCardView} from '../view/new-film-card-view.js';
import {render} from '../render.js';
import {NewPopupView} from '../view/new-popup-view.js';
import {NewCommentsView} from '../view/new-popup-view.js';
import {NoFeatureView} from '../view/no-feature-view';

const TASK_COUNT_PER_STEP = 5;

const siteMainElement=document.querySelector('.main');
const siteBody=document.querySelector('body');
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

    for (let i = 0; i < Math.min(this.#boardFeatures.length, TASK_COUNT_PER_STEP); i++) {
      this.#renderFeature(this.#boardFeatures[i]);
    }

    if (this.#boardFeatures.length > TASK_COUNT_PER_STEP) {
      render(this.#loadMoreButtonComponent, this.filmsListSection.element);
      this.#loadMoreButtonComponent.element.addEventListener('click', this.#handleLoadMoreButtonClick);
    }
  };

  #handleLoadMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#boardFeatures
      .slice(this.#renderedFeatureCount, this.#renderedFeatureCount + TASK_COUNT_PER_STEP)
      .forEach((task) => this.#renderFeature(task));

    this.#renderedFeatureCount += TASK_COUNT_PER_STEP;

    if (this.#renderedFeatureCount >= this.#boardFeatures.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #renderFeature(task) {
    const popupComments = this.#featureModel.getCommentForFeature(this.#boardFeatures[0].id);
    const commentsAmount=popupComments.length;
    const featureComponent= new NewFilmCardView(task);
    render(featureComponent, this.filmsListContainer.element);

    function renderPopup() {
      const popupComponent=new NewPopupView(task);
      document.body.append(popupComponent.element);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
      popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseButtonClick);
    }

    function renderPopupComments(arr) {
      for (let j = 0; j < arr.length; j++) {
        render(new NewCommentsView(arr[j]), siteBody.querySelector('.film-details__comments-list'));
      }
      siteBody.querySelector('.film-details__comments-count').textContent=commentsAmount;
    }

    featureComponent.element.addEventListener('click',()=>{
      renderPopup();
      renderPopupComments(popupComments);
    });

    function onCloseButtonClick() {
      document.querySelector('.film-details').remove();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('click', onCloseButtonClick);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    function onEscKeyDown(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        onCloseButtonClick();
      }
    }
  }
}
