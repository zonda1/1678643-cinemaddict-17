import {NewFilmCardView} from '../view/new-film-card-view.js';
import {NewPopupView} from '../view/new-popup-view.js';
import {NewCommentsView} from '../view/new-popup-view.js';
import {render,replace,remove} from '../framework/render.js';

const siteBody=document.querySelector('body');

export default class FilmPresenter {

  #task = null;
  #filmsListContainer=null;
  #featureComponent=null;
  #popupComponent=null;
  #popupComments=null;
  #commentsAmount=null;
  #featureModel=null;
  #boardFeatures=null;
  #changeData = null;

  constructor(filmsListContainer,featureModel,boardFeatures, changeData) {
    this.#filmsListContainer = filmsListContainer;
    this.#featureModel = featureModel;
    this.#boardFeatures = boardFeatures;
    this.#changeData=changeData;
  }

  init = (task) => {
    this.#task = task;

    const prevFeatureComponent=this.#featureComponent;
    // const prevPopupComponent=this.#popupComponent;

    this.#popupComments = this.#featureModel.getCommentForFeature(this.#boardFeatures[0].id);

    this.#commentsAmount=this.#popupComments.length;

    this.#featureComponent= new NewFilmCardView(task);

    if (prevFeatureComponent===null) {
      render(this.#featureComponent, this.#filmsListContainer);

      this.#featureComponent.setClickPopupOpener(()=>{
        this.#renderPopup();
        this.#renderPopupComments(this.#popupComments);
      });
      this.#featureComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
      this.#featureComponent.setWatchedClickHandler(this.#handleWatchedClick);
      this.#featureComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      // console.log(this.#changeData);
      // console.log(this.#featureComponent);
      return;
    }

    if (this.#filmsListContainer.contains(prevFeatureComponent.element)) {
      replace(this.#featureComponent,prevFeatureComponent);
    }
    remove(prevFeatureComponent);
  };

  destroy=()=>{
    remove(this.#featureComponent);
  };

  #renderPopup() {
    this.#popupComponent=new NewPopupView(this.#task);
    document.body.append(this.#popupComponent.element);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown',this.#onEscKeyDown);
    this.#popupComponent.setClickPopupCloser(this.#onCloseButtonClick);
  }

  #onEscKeyDown=(evt)=> {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#onCloseButtonClick();
    }
  };

  #onCloseButtonClick=()=> {
    document.querySelector('.film-details').remove();
    document.body.classList.remove('hide-overflow');
    this.#popupComponent.removeClickPopupCloser(this.#onCloseButtonClick);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };


  #renderPopupComments(arr) {
    for (let j = 0; j < arr.length; j++) {
      render(new NewCommentsView(arr[j]), siteBody.querySelector('.film-details__comments-list'));
    }
    siteBody.querySelector('.film-details__comments-count').textContent=this.#commentsAmount;
  }

  #handleWatchlistClick = () => {
    this.#changeData({...this.#task, watchlist: !this.#task.userDetails.watchlist});
  };

  #handleWatchedClick = () => {
    this.#changeData({...this.#task, alreadyWatched: !this.#task.userDetails.alreadyWatched});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#task, favorite: !this.#task.userDetails.favorite});
  };
}
