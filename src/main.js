import {render} from './framework/render.js';
import {generateFilmFeature} from './mock/feature.js';
import {generateFilmComments} from './mock/feature.js';
// import {generateFilter} from './mock/filter.js';
import {NewUserLogoView} from './view/new-user-logo-view.js';
import {BoardPresenter} from './presenter/board-presenter.js';
import {FeatureModel} from './model/feature-model.js';
import {CommentModel} from './model/comment-model';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import FeaturesApiService from './features-api-service.js';
// import { NewPopupView } from './view/new-popup-view.js';
// import { AUTHORIZATION } from './const/const.js';
// import { END_POINT } from './const/const.js';

const AUTHORIZATION = 'Basic jGrid45';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteHeaderElement=document.querySelector('.header');
const siteMainElement=document.querySelector('.main');

// const features = Array.from({length: 12}, generateFilmFeature);
// const comments = features.flatMap((film)=>Array.from({length: 10},()=>generateFilmComments(film.id)));

// console.log(features);
// console.log(comments);


const apiService=new FeaturesApiService(END_POINT, AUTHORIZATION);
const featureModel=new FeatureModel(apiService);
const commentModel=new CommentModel(apiService);
const filterModel=new FilterModel();
const boardPresenter=new BoardPresenter(featureModel,commentModel,filterModel);

// const popupComponent=new NewPopupView(new FeaturesApiService(END_POINT, AUTHORIZATION));

const filterPresenter=new FilterPresenter(siteMainElement,filterModel,featureModel);
render(new NewUserLogoView(), siteHeaderElement);
filterPresenter.init();
boardPresenter.init(siteMainElement);
featureModel.init();
// commentModel.init();
