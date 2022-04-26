import {render} from './render.js';
import {NewFilterView} from './view/new-filter-view.js';
import {NewSortView} from './view/new-sort-view.js';
import {NewUserLogoView} from './view/new-userLogo-view.js';
import {BoardPresenter} from './presenter/board-presenter.js';
import {NewPopupView} from './view/new-popup-view.js';


const siteBody=document.querySelector('body');
const siteHeaderElement=document.querySelector('.header');
const siteMainElement=document.querySelector('.main');


const boardPresenter=new BoardPresenter();

render(new NewUserLogoView(), siteHeaderElement);
render(new NewFilterView(), siteMainElement);
render(new NewSortView(), siteMainElement);
boardPresenter.init(siteMainElement);
render(new NewPopupView(), siteBody);

