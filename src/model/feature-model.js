import Observable from '../framework/observable';
import { UpdateType } from '../const/const';
export class FeatureModel extends Observable {
  #features=[];
  #featuresApiService=null;

  constructor (featuresApiService) {
    super();
    this.#featuresApiService=featuresApiService;
  }

  init=async()=>{
    try {
      const features = await this.#featuresApiService.features;
      this.#features = features.map(this.#adaptToClient);
    } catch(err) {
      this.#features = [];
    }
    this._notify(UpdateType.INIT);
  };

  #adaptToClient = (feature) => {
    const adaptedFeature = {...feature,
      // dueDate: feature['due_date'] !== null ? new Date(feature['due_date']) : feature['due_date'], // На клиенте дата хранится как экземпляр Date
      filmInfo:{...feature['film_info'],
        alternativeTitle:feature['film_info']['alternative_title'],
        totalRating:feature['film_info']['total_rating'],
        ageRating:feature['film_info']['age_rating']},

      userDetails:{...feature['user_details'],
        alreadyWatched:feature['user_details']['already_watched'],
        watchingDate:feature['user_details']['watching_date']},
    };

    // Ненужные ключи мы удаляем
    delete adaptedFeature['film_info'];
    delete adaptedFeature.filmInfo['alternative_title'];
    delete adaptedFeature.filmInfo['total_rating'];
    delete adaptedFeature.filmInfo['age_rating'];
    delete adaptedFeature['user_details'];
    delete adaptedFeature.userDetails['already_watched'];
    delete adaptedFeature.userDetails['watching_date'];

    return adaptedFeature;
  };

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
