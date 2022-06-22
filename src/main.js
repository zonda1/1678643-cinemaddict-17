import {render} from './framework/render.js';
import {NewUserLogoView} from './view/new-user-logo-view.js';
import {BoardPresenter} from './presenter/board-presenter.js';
import {FeatureModel} from './model/feature-model.js';
import {CommentModel} from './model/comment-model';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import FeaturesApiService from './features-api-service.js';

const AUTHORIZATION = 'Basic jGrid45';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteHeaderElement=document.querySelector('.header');
const siteMainElement=document.querySelector('.main');

const apiService=new FeaturesApiService(END_POINT, AUTHORIZATION);
const featureModel=new FeatureModel(apiService);
const commentModel=new CommentModel(apiService);
const filterModel=new FilterModel();
const boardPresenter=new BoardPresenter(featureModel,commentModel,filterModel);


const filterPresenter=new FilterPresenter(siteMainElement,filterModel,featureModel);
render(new NewUserLogoView(), siteHeaderElement);
filterPresenter.init();
boardPresenter.init(siteMainElement);
featureModel.init();
