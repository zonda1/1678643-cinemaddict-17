import Observable from '../framework/observable';
export class FeatureModel extends Observable {
  #features=null;

  constructor (features) {
    super();
    this.#features=features;
  }

  get features() {return this.#features;}

  setFeatures(features) {
    this.#features=features;
  }

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
