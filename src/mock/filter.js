import {FilterType} from '../const/const.js';

const filter = {
  [FilterType.ALL]: (tasks) => tasks.filter((task) => !task.userDetails.watchlist && !task.userDetails.alreadyWatched && !task.userDetails.favorite),
  [FilterType.WATCHLIST]: (tasks) => tasks.filter((task) => task.userDetails.watchlist),
  [FilterType.HISTORY]: (tasks) => tasks.filter((task) => task.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.userDetails.favorite),
};

export const generateFilter = (tasks) => Object.entries(filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(tasks).length,
  }),
);

