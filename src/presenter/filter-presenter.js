import {FilterType, UpdateType} from '../const/const.js';
import {filter}  from '../mock/filter';
import {render,replace,remove} from '../framework/render.js';
import { NewFilterView } from '../view/new-filter-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #featureModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, featureModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#featureModel = featureModel;

    //Подписки
    this.#featureModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const features = this.#featureModel.features;

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](features).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](features).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](features).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](features).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new NewFilterView(filters);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

}
