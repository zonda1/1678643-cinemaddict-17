import {NewFilterView} from '../view/new-filter-view.js';
import {NewSortView} from '../view/new-sort-view.js';
import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {render,remove} from '../framework/render.js';
import {NoFeatureView} from '../view/no-feature-view';
import FilmPresenter from './film-presenter';
import {sortDateDown,sortRatingDown} from '../utils.js';
import { SortType,UserAction,UpdateType} from '../const/const.js';

const TASK_COUNT_PER_STEP = 5;

const siteMainElement=document.querySelector('.main');

export class BoardPresenter {
  #boardContainer=null;
  #featureModel=null;
  filmsSection = new NewFilmsSectionView();
  filmsListSection = new NewFilmsListSectionView();
  filmsListContainer = new NewFilmsListContainerView();
  #loadMoreButtonComponent = new NewButtonView();
  #sortComponent=new NewSortView();
  #currentSortType=SortType.DEFAULT;
  #filterFeatures=null;
  #filmPresenter=new Map();

  #renderedFeatureCount = TASK_COUNT_PER_STEP;

  init = (boardContainer,featureModel,filterFeatures) => {

    this.#boardContainer = boardContainer;
    this.#featureModel = featureModel;
    this.#filterFeatures=filterFeatures;

    // this.#featureModel.addObserver(this.#handleModelEvent);

    if (this.features.every((film)=>film.isArchive)) {
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

  get features() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return this.#featureModel.features.sort(sortDateDown);

      case SortType.RATING:
        return this.#featureModel.features.sort(sortRatingDown);
    }
    return this.#featureModel.features;
  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
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
    const featureCount=this.features.length;
    const features=this.features.slice(0, Math.min(featureCount, TASK_COUNT_PER_STEP));

    this.#renderFeatures(features);

    if (featureCount > TASK_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderFeatures = (features) => {
    features.forEach((feature)=>this.#renderFeature(feature));
  };


  #renderFeature(task) {
    const comments = this.#featureModel.getCommentForFeature(task.id);
    const filmPresenter = new FilmPresenter(this.filmsListContainer.element,comments,this.#handleViewAction,this.#handleOpenPopup);
    filmPresenter.init(task);
    this.#filmPresenter.set(task.id,filmPresenter);
  }

  //Метод к-й был у нас до изспользования паттерна Observerbal

  // #handleFeatureChange = (updatedTask) => {
  //   this.#boardFeatures = updateItem(this.#boardFeatures, updatedTask);
  //   this.#sourcedBoardFeatures = updateItem(this.#sourcedBoardFeatures, updatedTask);
  //   this.#filmPresenter.get(updatedTask.id).init(updatedTask);
  // };

  //Новый метод-обработчик пользовательского действия
  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    // switch (actionType) {
    //   case UserAction.UPDATE_TASK:
    //     this.#featureModel.updateItem(updateType, update);
    //     break;
    // case UserAction.ADD_TASK:
    //   this.#tasksModel.addTask(updateType, update);
    //   break;
    // case UserAction.DELETE_TASK:
    //   this.#tasksModel.deleteTask(updateType, update);
    //   break;
    // }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    // switch (updateType) {
    // case UpdateType.PATCH:
    // - обновить часть списка (например, когда поменялось описание)
    // this.#filmPresenter.get(data.id).init(data);
    //   break;
    // case UpdateType.MINOR:
    // - обновить список (например, когда задача ушла в архив)
    // break;
    // case UpdateType.MAJOR:
    // - обновить всю доску (например, при переключении фильтра)
    // break;
    // }
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
    // this.#renderFeatures(this.#renderedFeatureCount, this.#renderedFeatureCount + TASK_COUNT_PER_STEP);
    // this.#renderedFeatureCount += TASK_COUNT_PER_STEP;

    const featureCount=this.features.length;

    const newRenderedFeatureCount = Math.min(featureCount, this.#renderedFeatureCount + TASK_COUNT_PER_STEP);
    const features = this.features.slice(this.#renderedFeatureCount, newRenderedFeatureCount);

    this.#renderFeatures(features);
    this.#renderedFeatureCount = newRenderedFeatureCount;

    if (this.#renderedFeatureCount >= featureCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };
}
