import {createElement} from '../render.js';
import {humanizeTaskDueDate} from '../utils.js';

const createNewFilmCardTemplate = (feature) => {
  const {title,posters, description, runtime, genre} = feature.filmInfo;
  const {date}=feature.filmInfo.release;
  const filmDate=humanizeTaskDueDate(date);
  const {watchlist,alreadyWatched:watched,favorite}=feature.userDetails;

  const isUserDetailActive=(detail)=> detail ? 'film-card__controls-item--active': '';

  // const archiveClassName = isArchive
  //   ? 'card__btn--archive card__btn--disabled'
  //   : 'card__btn--archive';

  // const favoriteClassName = isFavorite
  //   ? 'card__btn--favorites card__btn--disabled'
  //   : 'card__btn--favorites';

  return (`
<article class="film-card">
<a class="film-card__link">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">8.3</p>
  <p class="film-card__info">
    <span class="film-card__year">${filmDate}</span>
    <span class="film-card__duration">${runtime}m</span>
    <span class="film-card__genre">${genre}</span>
  </p>
  <img src="${posters}" alt="" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <span class="film-card__comments">5 comments</span>
</a>
<div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isUserDetailActive(watchlist)}" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched  ${isUserDetailActive(watched)}" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite ${isUserDetailActive(favorite)}" type="button">Mark as favorite</button>
</div>
</article>`);};

export class NewFilmCardView {

  constructor(feature) {
    this.feature = feature;
  }

  getTemplate() {
    return createNewFilmCardTemplate(this.feature);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
