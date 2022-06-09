import Observable from '../framework/observable';
export class FeatureModel extends Observable {
  #features=null;
  #comments=null;

  constructor (features,comments) {
    super();
    this.#features=features;
    this.#comments=comments;
  }

  get features() {return this.#features;}
  get comments() {return this.#comments;}

  getCommentForFeature(id) {return this.#comments.filter((comment)=>comment.id===id);}

  updateItem = (updateType, update) => {
    const index = this.#features.findIndex((item) => item.id === update.id);

    if (index === -1) {
      return this.#features;
    }

    this.#features= [
      ...this.#features.slice(0, index),
      update,
      ...this.#features.slice(index + 1),
    ];
    this._notify(updateType, update);
  };

}
