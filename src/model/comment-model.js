import Observable from '../framework/observable';

export class CommentModel extends Observable {
  #comments=null;
  #featuresApiService=null;

  constructor (featuresApiService) {
    super();
    this.#featuresApiService=featuresApiService;
  }

  get comments() {return this.#comments;}

  getCommentsForFilm(film) {
    return this.#featuresApiService.getCommentsForFilm(film);
  }

  deleateComment = async (updateType, update) => {
    try {
      await this.#featuresApiService.deleteComment(update);
      this._notify(updateType,update);
    }
    catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };


  addComment = async (updateType, update) => {
    try {
      await this.#featuresApiService.addComment(update);
      this._notify(updateType, {id:update.idFilm});
    } catch(err) {
      throw new Error('Can\'t add new comment');
    }
  };
}
