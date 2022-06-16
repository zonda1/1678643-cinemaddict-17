import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FeaturesApiService extends ApiService {
  get features() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  get comments() {
    return this._load({url: `comments/${this.getFilmId}`})
      .then(ApiService.parseResponse);
  }

  getFilmId=(feature) => feature.id;

  updateFeature = async (feature) => {
    const response = await this._load({
      url: `movies/${feature.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(feature)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer=(feature)=> {
    const adaptedFeature={...feature,
      'film_info':{...feature.filmInfo,
        'alternative_title':feature.filmInfo.alternativeTitle,
        'total_rating':feature.filmInfo.totalRating,
        'age_rating':feature.filmInfo.ageRating},

      'user_details':{...feature.userDetails,
        'already_watched':feature.userDetails.alreadyWatched,
        'watching_date':feature.userDetails.watchingDate},
    };
    delete adaptedFeature.filmInfo;
    delete adaptedFeature.filmInfo.alternativeTitle;
    delete adaptedFeature.filmInfo.totalRating;
    delete adaptedFeature.filmInfo.ageRating;
    delete adaptedFeature.userDetails;
    delete adaptedFeature.userDetails.alreadyWatched;
    delete adaptedFeature.userDetails.watchingDate;

    return adaptedFeature;
  };

}
