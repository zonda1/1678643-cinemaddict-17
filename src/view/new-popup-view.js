/* eslint-disable quotes */
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {humanizeWholeDate,humanizeWholeDateWithTime,convertIntoHours} from '../utils.js';
import { EMOTIONS } from '../const/const';
import { nanoid } from 'nanoid';

//Шаблон для рендеринга эмодзи в виде списка радиокнопок
const createNewEmotionTemplate=(chosenEmotion)=>EMOTIONS.map((emotion)=>`
<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${(emotion===chosenEmotion)?'checked':''}>
<label class="film-details__emoji-label" for="emoji-${emotion}">
  <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
</label>`).join('');

//Шаблон для рендеринга блока для ввода нового комента
const createNewCommentTemplate=(chosenEmotion,newComment)=> (`
<div class="film-details__new-comment">

<div class="film-details__add-emoji-label">
${(chosenEmotion!==null)? `<img src="./images/emoji/${chosenEmotion}.png" width="30" height="30" alt="emoji">`:''}
</div>

<label class="film-details__comment-label">
  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newComment}</textarea>
</label>

<div class="film-details__emoji-list">
  ${createNewEmotionTemplate(chosenEmotion)}
</div>
</div>`);


//Шаблон для рендеринга списка загружаемых коментов
const createAllCommentsTemplate=(comments)=>{
  const {id,comment,author,date,emotion}=comments;
  const commentDate=humanizeWholeDateWithTime(date);

  return (`<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${commentDate}</span>
      <button class="film-details__comment-delete" data-id="${id}">Delete</button>
    </p>
  </div>
</li>
`);};


const createNewPopupTemplate = (feature) => {
  const {title,alternativeTitle,poster, description, runtime, genre,director,writers,actors,totalRating,ageRating} = feature.filmInfo;
  const {date}=feature.filmInfo.release;
  const {comments=[]}=feature;
  const {chosenEmotion,newComment}=feature;
  const filmDate=humanizeWholeDate(date);
  const {watchlist,alreadyWatched:watched,favorite}=feature.userDetails;
  const isUserDetailActive=(detail)=> detail ? 'film-details__control-button--active': '';
  const newCommentTempalte=createNewCommentTemplate(chosenEmotion,newComment);

  return (`<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src=${poster} alt="">

        <p class="film-details__age">${ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${alternativeTitle}</h3>
            <p class="film-details__title-original">Original: ${title}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${filmDate}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${convertIntoHours(runtime)}m</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">USA</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              <span class="film-details__genre">${genre}</span>
          </tr>
        </table>

        <p class="film-details__film-description">${description}
        </p>
      </div>
    </div>

    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isUserDetailActive(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${isUserDetailActive(watched)}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${isUserDetailActive(favorite)}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>

  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
      ${comments.map(createAllCommentsTemplate).join('')}
      </ul>
      ${newCommentTempalte}

    </section>
  </div>
</form>
</section>`);};


export class NewPopupView extends AbstractStatefulView {

  constructor(feature) {
    super();
    this._state=NewPopupView.parseFeaturesToState(feature);
    this.#setInnerHandlers();
  }

  get template() {
    return createNewPopupTemplate(this._state);
  }

  setComments(comments) {
    this.updateElement({comments:comments});
  }

  deleateComment() {
    super.removeElement();
  }

  static parseFeaturesToState = (feature) => ({...feature,
    chosenEmotion: null,
    newComment:''
  });

  static parseStateToFeatures = (state) => {
    const feature = {...state};

    if (!feature.chosenEmotion) {
      feature.chosenEmotion = null;
    }

    delete feature.chosenEmotion;

    return feature;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClickPopupCloser(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCommentDeleateClickHandler(this._callback.deleateCommentClick);
  };

  #setInnerHandlers = () => {
    const buttons=this.element.querySelectorAll('.film-details__emoji-item');
    for (let i=0; i<buttons.length; i++) {
      buttons[i].addEventListener('change',this.#emotionPickHandler);
    }
    this.element.querySelector('textarea').addEventListener('change',this.#newCommentInput);
  };

  #emotionPickHandler = (evt) => {
    evt.preventDefault();
    const oldScrollPosition=this.element.scrollTop;
    this.updateElement({
      chosenEmotion: evt.target.value
    });
    this.element.scrollTop=oldScrollPosition;
  };

  setClickPopupCloser = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickClosePopupHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  //Обработчик удаления комментария
  setCommentDeleateClickHandler = (callback) => {
    this._callback.deleateCommentClick = callback;
    const buttonDeleate=this.element.querySelectorAll('.film-details__comment-delete');
    for (let i=0; i<buttonDeleate.length; i++) {
      buttonDeleate[i].addEventListener('click',this.#commentDeleateClickHandler);
    }
  };

  //Обработчик отправки формы
  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('textarea').addEventListener('keydown', this.#newCommentSubmit);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #commentDeleateClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleateCommentClick({idFilm:this._state.id, id:evt.currentTarget.dataset.id});
  };

  #newCommentInput = (evt) => {
    evt.preventDefault();
    const oldScrollPosition=this.element.scrollTop;
    this.updateElement({
      newComment: evt.currentTarget.value
    });
    this.element.scrollTop=oldScrollPosition;
  };

  #newCommentSubmit = (evt) => {
    if(evt.key==='Enter' && evt.ctrlKey){
      evt.preventDefault();
      this._callback.formSubmit({
        id:nanoid(),
        idFilm:this._state.id,
        author: 'Ilya O\'Reilly',
        comment: this._state.newComment,
        date: '2019-05-11T16:12:32.554Z',
        emotion: this._state.chosenEmotion
      });
      this.updateElement({
        chosenEmotion:'',
        newComment: ''
      });
    }
  };

  #clickClosePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}


