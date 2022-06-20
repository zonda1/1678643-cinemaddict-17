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

  #map=new Map();

  getCommentsForFilm(film) {
    return this.#featuresApiService.getCommentsForFilm(film);
  }

//   getCommentsForCurrentFilm(update) {
//     if (this.#map.has(update.idFilm)) {
//       return this.#map.get(update.idFilm);
//     }
//     this.#featuresApiService.getCommentsForFilm(update).then(()=>{
//       this.#map.set(update.idFilm,update.comments);
//       this._notify(updateType,{id:update.id});
//     });
//     return [];
//   }

  deleateComment = async (updateType, update) => {
    // this.#comments=update.comments;
    // const index = this.#comments.findIndex((comment) => comment.id === update.id);

    // if (index === -1) {
    //   throw new Error('Can\'t delete unexisting comment');
    // }

    try {
      await this.#featuresApiService.deleteComment(update);
      // this.#comments = [
      //   ...this.#comments.slice(0, index),
      //   ...this.#comments.slice(index + 1),
      // ];
      this._notify(updateType,update);
      // this._notify(updateType,{id:update.id});
    }
    catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };


  addComment = async (updateType, update) => {
    try {
      await this.#featuresApiService.addComment(update);
      // this.#comments = [
      //   response,
      //   ...this.#comments,
      // ];
      this._notify(updateType, {id:update.idFilm});
    } catch(err) {
      throw new Error('Can\'t add new comment');
    }
  };
}
