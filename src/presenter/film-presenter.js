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
  #changeData = null;
  #handleOpenPopup=null;

  constructor(filmsListContainer,popupComments,changeData,handleOpenPopup) {
    this.#filmsListContainer = filmsListContainer;
    this.#popupComments=popupComments;
    this.#changeData=changeData;
    this.#handleOpenPopup=handleOpenPopup;
  }

  init = (task) => {
    this.#task = task;
    const prevFeatureComponent=this.#featureComponent;
    this.#featureComponent= new NewFilmCardView(task);
    this.#commentsAmount=this.#popupComments.length;

    this.#featureComponent.setClickPopupOpener(()=>{
      this.#renderPopup();
    });

    this.#featureComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#featureComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#featureComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFeatureComponent===null) {
      render(this.#featureComponent, this.#filmsListContainer);
      return;
    }
    //Чтобы увидеть измененное состояние кнопок, мы удаляем текущий компонент и рендерим новый
    if (this.#popupComponent) {
      this.#onCloseButtonClick();
      this.#renderPopup();
    }

    if (this.#filmsListContainer.contains(prevFeatureComponent.element)) {
      replace(this.#featureComponent,prevFeatureComponent);
    }
    remove(prevFeatureComponent);
  };

  destroy=()=>{
    remove(this.#featureComponent);
  };

  closePopup=()=>{
    if (this.#popupComponent) {
      this.#onCloseButtonClick();
    }
  };

  #renderPopup() {
    this.#handleOpenPopup();
    this.#popupComponent=new NewPopupView(this.#task);
    document.body.append(this.#popupComponent.element);
    this.#renderPopupComments(this.#popupComments);
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
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
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent=null;
  };


  #renderPopupComments(arr) {
    for (let j = 0; j < arr.length; j++) {
      render(new NewCommentsView(arr[j]), siteBody.querySelector('.film-details__comments-list'));
    }
    siteBody.querySelector('.film-details__comments-count').textContent=this.#commentsAmount;
  }

  #handleWatchlistClick = () => {
    this.#changeData({...this.#task, userDetails:{...this.#task.userDetails,watchlist: !this.#task.userDetails.watchlist}});
  };

  #handleWatchedClick = () => {
    this.#changeData({...this.#task, userDetails:{...this.#task.userDetails,alreadyWatched: !this.#task.userDetails.alreadyWatched}});
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#task, userDetails:{...this.#task.userDetails,favorite: !this.#task.userDetails.favorite}});
  };
}
