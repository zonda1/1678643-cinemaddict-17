export class FeatureModel {
  #features=null;
  #comments=null;

  constructor (features,comments) {
    this.#features=features;
    this.#comments=comments;
  }

  get features() {return this.#features;}
  get comments() {return this.#comments;}

  getCommentForFeature(id) {return this.#comments.filter((comment)=>comment.id===id);}
}
