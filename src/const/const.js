const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

// const AUTHORIZATION = 'Basic jGrid45';
// const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export {FilterType,SortType, UserAction,UpdateType, EMOTIONS};
