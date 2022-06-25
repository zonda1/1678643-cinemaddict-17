import {FilterType} from '../const/const.js';
import { sortRatingDown,getMaxElements } from '../utils.js';


export const filter = {
  [FilterType.ALL]: (tasks) => tasks.slice(),
  [FilterType.WATCHLIST]: (tasks) => tasks.filter((task) => task.userDetails.watchlist),
  [FilterType.HISTORY]: (tasks) => tasks.filter((task) => task.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.userDetails.favorite),
  [FilterType.TOP_RATED]: (tasks) => tasks.sort(sortRatingDown).slice(0,2),
  [FilterType.TOP_COMMENTED]: (tasks) => getMaxElements(tasks).slice(0,2),
};


