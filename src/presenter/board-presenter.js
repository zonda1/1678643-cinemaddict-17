import {NewFilterView} from '../view/new-filter-view.js';
import {NewSortView} from '../view/new-sort-view.js';
import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {render,remove} from '../framework/render.js';
import {NoFeatureView} from '../view/no-feature-view';
import FilmPresenter from './film-presenter';
import {updateItem,sortDateDown,sortRatingDown} from '../utils.js';
import { SortType } from '../const/const.js';

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
  #sortComponent=new NewSortView();
  #currentSortType=SortType.DEFAULT;
  #sourcedBoardFeatures=[];
  #filterFeatures=null;
  #popupComments=null;
  #filmPresenter=new Map();

  #renderedFeatureCount = TASK_COUNT_PER_STEP;

  init = (boardContainer,featureModel,filterFeatures) => {

    this.#boardContainer = boardContainer;
    this.#featureModel = featureModel;
    this.#boardFeatures = [...this.#featureModel.features];
    // 1. Записываем исходный массив с фильмами по ссылке, чтобы после мутаций массива мы смогли вернуться в исходное состояние
    this.#sourcedBoardFeatures = [...this.#featureModel.features];
    this.#filterFeatures=filterFeatures;

    if (this.#boardFeatures.every((film)=>film.isArchive)) {
      render(this.filmsSection, this.#boardContainer);
      render(this.filmsListSection, this.filmsSection.element);
      render(new NoFeatureView(),this.filmsListSection.element);
    }
    else {
      render(new NewFilterView(this.#filterFeatures), siteMainElement);
      this.#renderSort();
      render(this.filmsSection, this.#boardContainer);
      render(this.filmsListSection, this.filmsSection.element);
      render(this.filmsListContainer, this.filmsListSection.element);
    }
    this.#renderFeatureList();
  };

  #sortTasks = (sortType) => {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE:
        this.#boardFeatures.sort(sortDateDown);
        break;
      case SortType.RATING:
        this.#boardFeatures.sort(sortRatingDown);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#boardFeatures = [...this.#sourcedBoardFeatures];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortTasks(sortType);
    // - Очищаем список
    this.#clearFeatureList();
    // - Рендерим список заново
    this.#renderFeatureList();
  };

  #renderSort=()=> {
    render(this.#sortComponent, siteMainElement);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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
    const comments = this.#featureModel.getCommentForFeature(task.id);
    const filmPresenter = new FilmPresenter(this.filmsListContainer.element,comments,this.#handleFeatureChange,this.#handleOpenPopup);
    filmPresenter.init(task);
    this.#filmPresenter.set(task.id,filmPresenter);
  }

  #handleFeatureChange = (updatedTask) => {
    this.#boardFeatures = updateItem(this.#boardFeatures, updatedTask);
    this.#sourcedBoardFeatures = updateItem(this.#sourcedBoardFeatures, updatedTask);
    this.#filmPresenter.get(updatedTask.id).init(updatedTask);
  };

  #handleOpenPopup = () => {
    for (const presenter of this.#filmPresenter.values()) {
      presenter.closePopup();
    }
  };

  #clearFeatureList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFeatureCount = TASK_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.filmsListSection.element);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFeatures(this.#renderedFeatureCount, this.#renderedFeatureCount + TASK_COUNT_PER_STEP);
    this.#renderedFeatureCount += TASK_COUNT_PER_STEP;

    if (this.#renderedFeatureCount >= this.#boardFeatures.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };
}
