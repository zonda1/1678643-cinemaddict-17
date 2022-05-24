import AbstractView from '../framework/view/abstract-view.js';

const createNewFilterItemTemplate = (filter) => {
  const {name,count}=filter;

  return (`
    <a href="#${name}" class="main-navigation__item">${name[0].toUpperCase() + name.slice(1)} <span class="main-navigation__item-count">${count}</span></a>
  `);};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createNewFilterItemTemplate(filter, index === 0))
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
