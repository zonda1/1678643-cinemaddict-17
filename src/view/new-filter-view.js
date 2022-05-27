import AbstractView from '../framework/view/abstract-view.js';
import { makeUpperCaseFirst } from '../utils.js';

const createNewFilterItemTemplate = (filter) => {
  const {name,count}=filter;
  if (name ==='all') {
    return (`
    <a href="#${name}" class="main-navigation__item">${makeUpperCaseFirst(name)}</a>
  `);}
  return (`
  <a href="#${name}" class="main-navigation__item">${makeUpperCaseFirst(name)} <span class="main-navigation__item-count">${count}</span></a>
`);
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createNewFilterItemTemplate(filter))
    .join('');

  return `<nav class="main-navigation">
      ${filterItemsTemplate}
      </nav>`;
};
export class NewFilterView extends AbstractView {
  #filter=null;

  constructor(filters) {
    super();
    this.#filter=filters;
  }

  get template() {
    return createFilterTemplate(this.#filter);
  }
}
