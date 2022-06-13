import Observable from '../framework/observable';

export class CommentModel extends Observable {

  #comments=null;

  constructor (comments) {
    super();
    this.#comments=comments;
  }

  get comments() {return this.#comments;}

  getCommentForFeature(id) {return this.#comments.filter((comment)=>comment.id===id);}

  deleateItem = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };

  addItem = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };
}
