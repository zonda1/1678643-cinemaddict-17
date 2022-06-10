import {render} from './framework/render.js';
import {generateFilmFeature} from './mock/feature.js';
import {generateFilmComments} from './mock/feature.js';
// import {generateFilter} from './mock/filter.js';
import {NewUserLogoView} from './view/new-user-logo-view.js';
import {BoardPresenter} from './presenter/board-presenter.js';
import {FeatureModel} from './model/feature-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement=document.querySelector('.header');
const siteMainElement=document.querySelector('.main');

const features = Array.from({length: 12}, generateFilmFeature);
// const comments = features.map((film)=> generateFilmComments(film.id));
const comments = features.flatMap((film)=>Array.from({length: 10}, ()=>generateFilmComments(film.id)));

const boardPresenter=new BoardPresenter();
const featureModel=new FeatureModel(features,comments);
const filterModel=new FilterModel();

const filterPresenter=new FilterPresenter(siteMainElement,filterModel,featureModel);
render(new NewUserLogoView(), siteHeaderElement);
filterPresenter.init();
boardPresenter.init(siteMainElement,featureModel,filterModel);

