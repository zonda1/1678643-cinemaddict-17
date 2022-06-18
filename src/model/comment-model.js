import Observable from '../framework/observable';

export class CommentModel extends Observable {
  #comments=null;
  #featuresApiService=null;

  constructor (featuresApiService) {
    super();
    this.#featuresApiService=featuresApiService;
    // this.#featuresApiService.comments.then((comments) => {
    //   console.log(comments);
    // });
  }

  get comments() {return this.#comments;}

  getCommentsForFilm(film) {
    return this.#featuresApiService.getCommentsForFilm(film);
  }


  getCommentForCurrentFilm=(feature)=>this.#featuresApiService.getFilmId(feature);
  getCommentForFeature(id) {return this.#comments.filter((comment)=>comment.idFilm===id);}

  deleateItem = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType,{id:update.idFilm});
  };

  addItem = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, {id:update.idFilm});
  };
}
