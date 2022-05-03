import {render} from './render.js';
import {generateFilmFeature} from './mock/feature.js';
import {generateFilmComments} from './mock/feature.js';
import {NewFilterView} from './view/new-filter-view.js';
import {NewSortView} from './view/new-sort-view.js';
import {NewUserLogoView} from './view/new-user-logo-view.js';
import {BoardPresenter} from './presenter/board-presenter.js';
import {NewPopupView} from './view/new-popup-view.js';
import {NewCommentsView} from './view/new-popup-view.js';
import {FeatureModel} from './model/feature-model.js';


const siteBody=document.querySelector('body');
const siteHeaderElement=document.querySelector('.header');
const siteMainElement=document.querySelector('.main');

const features = Array.from({length: 10}, generateFilmFeature);
// const comments = features.map((film)=> generateFilmComments(film.id));
const comments = features.flatMap((film)=>Array.from({length: 10}, ()=>generateFilmComments(film.id)));

const boardPresenter=new BoardPresenter();
const featureModel=new FeatureModel(features,comments);


render(new NewUserLogoView(), siteHeaderElement);
render(new NewFilterView(), siteMainElement);
render(new NewSortView(), siteMainElement);
boardPresenter.init(siteMainElement,featureModel);

const popupFeatures = [...featureModel.getFeatures()];
const popupComments = featureModel.getCommentForFeature(popupFeatures[0].id);

render(new NewPopupView(popupFeatures[0]), siteBody);
const commentsAmount=popupComments.length;
siteBody.querySelector('.film-details__comments-count').textContent=commentsAmount;

for (let j = 0; j < popupComments.length; j++) {
  render(new NewCommentsView(popupComments[j]), siteBody.querySelector('.film-details__comments-list'));
}

