import {NewSortView} from '../view/new-sort-view.js';
import {NewFilmsSectionView} from '../view/new-films-section-view';
import {NewFilmsListSectionView} from '../view/new-films-list-section-view';
import {NewFilmsListContainerView} from '../view/new-films-list-container-view';
import {NewButtonView} from '../view/new-button-view.js';
import {render,remove} from '../framework/render.js';
import {NoFeatureView} from '../view/no-feature-view';
import FilmPresenter from './film-presenter';
import {sortDateDown,sortRatingDown} from '../utils.js';
import { SortType,UserAction,UpdateType,FilterType} from '../const/const.js';
import {filter}  from '../filter/filter';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TASK_COUNT_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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
  #currentSortType=SortType.DEFAULT;
  #sortComponent=null;
  #filterModel=null;
  #filterType=FilterType.ALL;
  #noFeatureComponent=null;
  #filmPresenter=new Map();
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #renderedFeatureCount = TASK_COUNT_PER_STEP;

  constructor(featureModel,commentModel,filterModel) {
    this.#featureModel = featureModel;
    this.#filterModel=filterModel;
    this.#commentModel = commentModel;
  }

  init = (boardContainer) => {

    this.#boardContainer = boardContainer;

    this.#featureModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  };

  get features() {
    this.#filterType = this.#filterModel.filter;
    const features = this.#featureModel.features;
    const filteredTasks = filter[this.#filterType](features);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredTasks.sort(sortDateDown);
      case SortType.RATING:
        return filteredTasks.sort(sortRatingDown);
    }
    return filteredTasks;
  }

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort=()=> {
    this.#sortComponent = new NewSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, siteMainElement);
  };

  #renderFeatures = (features) => {
    features.forEach((feature)=>this.#renderFeature(feature));
  };


  #renderFeature(task) {
    const filmPresenter =this.#filmPresenter.has(task.id)?this.#filmPresenter.get(task.id): new FilmPresenter(this.filmsListContainer.element,this.#commentModel,this.#handleViewAction,this.#handleOpenPopup);
    filmPresenter.init(task);
    this.#filmPresenter.set(task.id,filmPresenter);
  }

  #clearFeatureList = ({resetRenderedTaskCount = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    if (resetRenderedTaskCount) {
      this.#renderedFeatureCount = TASK_COUNT_PER_STEP;
    }
    remove(this.#loadMoreButtonComponent);

    if (this.#noFeatureComponent) {
      remove(this.#noFeatureComponent);
    }

  };

  #clearBoard=({resetSortType = false} = {})=> {
    this.#clearFeatureList();
    remove(this.#sortComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderNoFeature() {
    this.#noFeatureComponent=new NoFeatureView(this.#filterType);
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


  #handleViewAction = async (actionType, updateType, update) => {

    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        try {
          await this.#featureModel.updateItem(updateType,  update);
        } catch (error) {
          this.#filmPresenter.get(update.id).setFilterAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPresenter.get(update.idFilm).setAdding();
        try {
          await this.#commentModel.addComment(updateType, update);
        } catch (error) {
          this.#filmPresenter.get(update.idFilm).setAddAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPresenter.get(update.id).setDeleating(update.idComment);
        try {
          await this.#commentModel.deleateComment(updateType,  update);
        } catch (error) {
          this.#filmPresenter.get(update.id).setDeleateAborting(update.idComment);
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(data.id)) {
          this.#filmPresenter.get(data.id).init(this.#featureModel.features.find((item)=>item.id===data.id));
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
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
