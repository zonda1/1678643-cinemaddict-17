import {NewFilmCardView} from '../view/new-film-card-view.js';
import {NewPopupView} from '../view/new-popup-view.js';
import {render,replace,remove} from '../framework/render.js';
import {UserAction,UpdateType} from '../const/const.js';


export default class FilmPresenter {

  #task = null;
  #filmsListContainer=null;
  #commentModel=null;
  #featureComponent=null;
  #popupComponent=null;
  #changeData = null;
  #handleOpenPopup=null;

  constructor(filmsListContainer,commentModel,changeData,handleOpenPopup) {
    this.#filmsListContainer = filmsListContainer;
    this.#commentModel=commentModel;
    this.#changeData=changeData;
    this.#handleOpenPopup=handleOpenPopup;
  }

  init = (task) => {
    this.#task = task;
    const prevFeatureComponent=this.#featureComponent;
    this.#featureComponent= new NewFilmCardView(task);
    this.#featureComponent.setClickPopupOpener(()=>{
      this.#renderPopup();
    });

    this.#featureComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#featureComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#featureComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFeatureComponent===null) {
      render(this.#featureComponent, this.#filmsListContainer);
    } else {
      if (this.#filmsListContainer.contains(prevFeatureComponent.element)) {
        replace(this.#featureComponent,prevFeatureComponent);
      }
      remove(prevFeatureComponent);
    }
    //Чтобы увидеть измененное состояние кнопок, мы удаляем текущий компонент и рендерим новый
    if (this.#popupComponent) {
      this.#onCloseButtonClick();
      this.#renderPopup();
    }
  };

  destroy=()=>{
    remove(this.#featureComponent);
    this.#featureComponent=null;
  };

  closePopup=()=>{
    if (this.#popupComponent) {
      this.#onCloseButtonClick();
    }
  };

  setAdding = () => {
    this.#popupComponent.updateElement({
      isDisabled: true,
    });
  };

  setDeleating = (idComment) => {
    this.#popupComponent.updateElement({
      isDeleating: idComment,
    });
  };

  setAddAborting = () => {

    const resetFormState = () => {
      this.#popupComponent.updateElement({
        isDisabled: false,
        isDeleating: false,
      });
    };

    this.#popupComponent.shake(resetFormState);
  };

  setDeleateAborting = (idComment) => {
    this.#popupComponent.updateElement({
      isDisabled: false,
      isDeleating: false,
      isShaking: idComment,
    });

    const resetFormState = () => {
      this.#popupComponent.updateElement({
        isShaking: false,
      });
    };
    this.#popupComponent.commentShake(resetFormState);
  };

  setFilterAborting = () => {
    this.#popupComponent.filterShake();
  };

  #renderPopup() {
    this.#handleOpenPopup();
    this.#popupComponent=new NewPopupView(this.#task);
    document.body.append(this.#popupComponent.element);
    this.#commentModel.getCommentsForFilm(this.#task).then((comments)=>this.#popupComponent.setComments(comments));
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#popupComponent.setCommentDeleateClickHandler(this.#handleDeleateCommentClick);
    this.#popupComponent.setFormSubmitHandler(this.#handleAddComment);

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

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#task, userDetails:{...this.#task.userDetails,watchlist: !this.#task.userDetails.watchlist}});
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#task, userDetails:{...this.#task.userDetails,alreadyWatched: !this.#task.userDetails.alreadyWatched}});
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#task, userDetails:{...this.#task.userDetails,favorite: !this.#task.userDetails.favorite}});
  };

  //Колбэк для удаления комментария
  #handleDeleateCommentClick=(comment)=> {
    this.#changeData(UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      comment);
  };

  //Колбэк для добавления комментария
  #handleAddComment = async (comment) => {
    if (comment.comment) {
      this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH, comment);
    } else {
      throw new Error('Invalid comment');
    }
  };
}
