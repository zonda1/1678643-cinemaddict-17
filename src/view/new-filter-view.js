import AbstractView from '../framework/view/abstract-view.js';
import { makeUpperCaseFirst } from '../utils.js';

const createNewFilterItemTemplate = (filter,currentFilterType) => {
  const {type,name,count}=filter;
  if (name ==='All') {
    return (`
    <a href="#${name}"
    ${type === currentFilterType ? 'checked' : ''} class="main-navigation__item">${makeUpperCaseFirst(name)}</a>
  `);}
  return (`
  <a href="#${name}"
  ${type === currentFilterType ? 'checked' : ''}class="main-navigation__item">${makeUpperCaseFirst(name)} <span class="main-navigation__item-count">${count}</span></a>
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
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
