import AbstractView from '../framework/view/abstract-view.js';
import {humanizeOnlyYear,convertIntoHours} from '../utils.js';

const createNewFilmCardTemplate = (feature) => {
  const {title,poster, description,totalRating,runtime, genre} = feature.filmInfo;
  const {date}=feature.filmInfo.release;
  const {comments=[]}=feature;
  const filmDate=humanizeOnlyYear(date);
  const {watchlist,alreadyWatched:watched,favorite}=feature.userDetails;
  const isUserDetailActive=(detail)=> detail ? 'film-card__controls-item--active': '';

  return (`
<article class="film-card">
<a class="film-card__link">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${totalRating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${filmDate}</span>
    <span class="film-card__duration">${convertIntoHours(runtime)}</span>
    <span class="film-card__genre">${genre[0]}</span>
  </p>
  <img src=${poster} alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <span class="film-card__comments">${comments.length} comments</span>
</a>
<div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isUserDetailActive(watchlist)}" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched  ${isUserDetailActive(watched)}" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite ${isUserDetailActive(favorite)}" type="button">Mark as favorite</button>
</div>
</article>`);};

export class NewFilmCardView extends AbstractView {

  #feature=null;

  constructor(feature) {
    super();
    this.#feature = feature;
  }

  get template() {
    return createNewFilmCardTemplate(this.#feature);
  }

  setClickPopupOpener = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickOpenPopupHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };


  #clickOpenPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
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
}
