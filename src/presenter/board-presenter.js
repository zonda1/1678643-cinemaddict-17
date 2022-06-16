/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
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
import {filter}  from '../mock/filter';
import LoadingView from '../view/loading-view.js';

const TASK_COUNT_PER_STEP = 5;

const siteMainElement=document.querySelector('.main');

export class BoardPresenter {
  #boardContainer=null;
  #featureModel=null;
  #commentModel=null;
  filmsSection = new NewFilmsSectionView();
  filmsListSection = new NewFilmsListSectionView();
  filmsListContainer = new NewFilmsListContainerView();
  #loadMoreButtonComponent = new NewButtonView();
  #loadingComponent = new LoadingView();
  #noFeatureComponent=new NoFeatureView();
  #currentSortType=SortType.DEFAULT;
  #sortComponent=null;
  #filterModel=null;
  #filmPresenter=new Map();
  #isLoading = true;

  #renderedFeatureCount = TASK_COUNT_PER_STEP;

  init = (boardContainer,featureModel,commentModel,filterModel) => {

    this.#boardContainer = boardContainer;
    this.#featureModel = featureModel;
    this.#filterModel=filterModel;
    this.#commentModel = commentModel;

    this.#featureModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    // this.#commentModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  };

  get features() {
    const filterType = this.#filterModel.filter;
    const features = this.#featureModel.features;
    const filteredTasks = filter[filterType](features);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredTasks.sort(sortDateDown);

      case SortType.RATING:
        return filteredTasks.sort(sortRatingDown);
    }
    return filteredTasks;
  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // - Очищаем список
    // this.#clearFeatureList();
    this.#clearBoard();
    // - Рендерим список заново
    this.#renderBoard();
  };

  #renderSort=()=> {
    this.#sortComponent = new NewSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, siteMainElement);
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
    // const comments = this.#commentModel.getCommentForFeature(feature.id);
    // const comments = this.#commentModel.init();
    this.#commentModel.init();
    console.log(this.#commentModel.comments);
    // const filmPresenter = new FilmPresenter(this.filmsListContainer.element,this.#handleViewAction,this.#handleOpenPopup);

    // filmPresenter.init(task,comments);
    // this.#filmPresenter.set(task.id,filmPresenter);
    const comments = this.#commentModel.getCommentForFeature(task.id);
    const filmPresenter =this.#filmPresenter.has(task.id)?this.#filmPresenter.get(task.id): new FilmPresenter(this.filmsListContainer.element,this.#handleViewAction,this.#handleOpenPopup);
    filmPresenter.init(task,comments);
    this.#filmPresenter.set(task.id,filmPresenter);
    // console.log(comments);
  }

  #clearFeatureList = ({resetRenderedTaskCount = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    // this.#filmPresenter.clear();
    if (resetRenderedTaskCount) {
      this.#renderedFeatureCount = TASK_COUNT_PER_STEP;
    }
    remove(this.#loadMoreButtonComponent);
  };

  #clearBoard=({resetSortType = false} = {})=> {
    this.#clearFeatureList();
    remove(this.#sortComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderNoFeature() {
    render(this.#noFeatureComponent,this.filmsListSection.element);
  }

  #renderLoading = () => {
    render(this.filmsSection, this.#boardContainer);
    render(this.filmsListSection, this.filmsSection.element);
    render(this.#loadingComponent, this.filmsListSection.element);
  };

  #renderBoard = () => {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const features = this.features;
    const featureCount = features.length;

    if (featureCount === 0) {
      this.#renderNoFeature();
      return;
    }

    this.#renderSort();
    render(this.filmsSection, this.#boardContainer);
    render(this.filmsListSection, this.filmsSection.element);
    render(this.filmsListContainer, this.filmsListSection.element);
    this.#renderFeatures(features.slice(0, Math.min(featureCount, this.#renderedFeatureCount)));

    if (featureCount > this.#renderedFeatureCount) {
      this.#renderLoadMoreButton();
    }
  };

  //Метод к-й был у нас до изспользования паттерна Observerbal

  // #handleFeatureChange = (updatedTask) => {
  //   this.#boardFeatures = updateItem(this.#boardFeatures, updatedTask);
  //   this.#sourcedBoardFeatures = updateItem(this.#sourcedBoardFeatures, updatedTask);
  //   this.#filmPresenter.get(updatedTask.id).init(updatedTask);
  // };

  //Новый метод-обработчик пользовательского действия
  #handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#featureModel.updateItem(updateType,  update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentModel.addItem(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentModel.deleateItem(updateType,  update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        const presenter=this.#filmPresenter.get(data.id);
        if (presenter) {
          presenter.init(this.#featureModel.features.find((item)=>item.id===data.id), this.#commentModel.getCommentForFeature(data.id));
        }
        break;
      case UpdateType.MINOR:
        // this.#clearFeatureList();
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
        // case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        // break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleOpenPopup = () => {
    for (const presenter of this.#filmPresenter.values()) {
      presenter.closePopup();
    }
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.filmsListSection.element);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleLoadMoreButtonClick = () => {
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
