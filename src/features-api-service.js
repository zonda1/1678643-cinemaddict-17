import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class FeaturesApiService extends ApiService {
  get features() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getCommentsForFilm(film) {
    return this._load({url: `comments/${film.id}`})
      .then(ApiService.parseResponse);
  }

  updateFeature = async (feature) => {
    const response = await this._load({
      url: `movies/${feature.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(feature)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  addComment = async (feature) => {
    const response = await this._load({
      url: `comments/${feature.idFilm}`,
      method: Method.POST,
      body: JSON.stringify(feature),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.idComment}`,
      method: Method.DELETE,
    });

    return response;
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
    delete adaptedFeature.filmInfo.alternativeTitle;
    delete adaptedFeature.filmInfo.totalRating;
    delete adaptedFeature.filmInfo.ageRating;
    delete adaptedFeature.filmInfo;
    delete adaptedFeature.userDetails.alreadyWatched;
    delete adaptedFeature.userDetails.watchingDate;
    delete adaptedFeature.userDetails;

    return adaptedFeature;
  };

}
