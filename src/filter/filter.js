import {FilterType} from '../const/const.js';

export const filter = {
  [FilterType.ALL]: (tasks) => tasks.slice(),
  [FilterType.WATCHLIST]: (tasks) => tasks.filter((task) => task.userDetails.watchlist),
  [FilterType.HISTORY]: (tasks) => tasks.filter((task) => task.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.userDetails.favorite),
};
