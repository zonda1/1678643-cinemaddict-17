import {NewFilmCardView} from '../view/new-film-card-view.js';
import {NewPopupView} from '../view/new-popup-view.js';
import {NewCommentsView} from '../view/new-popup-view.js';
import {render} from '../framework/render.js';

const siteBody=document.querySelector('body');

export default class FilmPresenter {

  #task = null;
  #filmsListContainer=null;


  constructor(filmsListContainer) {
    this.#filmsListContainer = filmsListContainer;
  }

  init = (task,featureModel,boardFeatures) => {
    this.#task = task;
    const popupComments = featureModel.getCommentForFeature(boardFeatures[0].id);
    const commentsAmount=popupComments.length;
    const featureComponent= new NewFilmCardView(task);
    render(featureComponent, this.#filmsListContainer);

    featureComponent.setClickPopupOpener(()=>{
      renderPopup();
      renderPopupComments(popupComments);
    });

    function renderPopup() {
      const popupComponent=new NewPopupView(task);
      document.body.append(popupComponent.element);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
      popupComponent.setClickPopupCloser(onCloseButtonClick);

      function onCloseButtonClick() {
        document.querySelector('.film-details').remove();
        document.body.classList.remove('hide-overflow');
        popupComponent.removeClickPopupCloser(onCloseButtonClick);
        document.removeEventListener('keydown', onEscKeyDown);
      }

      function onEscKeyDown(evt) {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          evt.preventDefault();
          onCloseButtonClick();
        }
      }
    }

    function renderPopupComments(arr) {
      for (let j = 0; j < arr.length; j++) {
        render(new NewCommentsView(arr[j]), siteBody.querySelector('.film-details__comments-list'));
      }
      siteBody.querySelector('.film-details__comments-count').textContent=commentsAmount;
    }
  };
}
