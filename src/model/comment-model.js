import Observable from '../framework/observable';
import { UpdateType } from '../const/const';

export class CommentModel extends Observable {
  #comments=[];
  #featuresApiService=null;

  constructor (featuresApiService) {
    super();
    this.#featuresApiService=featuresApiService;

    // this.#featuresApiService.comments.then((comments) => {
    //   console.log(comments);
    // });
  }

  init=async()=>{
    try {
      this.#comments  = await this.#featuresApiService.comments;
      // this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }
    // this._notify(UpdateType.INIT);
  };

  get comments() {return this.#comments;}

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
