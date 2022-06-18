import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const/const.js';

const createNewFilterItemTemplate = (filter,currentFilterType) => {
  const {type,name,count}=filter;
  if (name ==='All movies') {
    return (`
    <a href="#${name}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type=${FilterType.ALL}>${name}
    </a>
  `);}
  return (`
  <a href="#${name}"
  class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type=${type}>${name} <span class="main-navigation__item-count">${count}</span></a>
`);
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createNewFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
      ${filterItemsTemplate}
      </nav>`;
};
export class NewFilterView extends AbstractView {
  #filter=null;
  #currentFilter=null;

  constructor(filters,currentFilterType) {
    super();
    this.#filter=filters;
    this.#currentFilter=currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filter,this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };
}
