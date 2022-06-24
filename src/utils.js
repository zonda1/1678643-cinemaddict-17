import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';
import RelativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(Duration);
dayjs.extend(RelativeTime);

const MIN_PER_HOUR=60;
const FEW_MIN=6;

const getDeclension = function (time) {
  if (time.includes('seconds'))  {
    return 'now';
  }
  if (time.includes('minutes')) {
    if (Array.from(time)[0]<FEW_MIN) {
      return 'a few minutes ago';
    }
  }
  return `${time} ago`;
};

const humanizeOnlyYear = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeWholeDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const calculateTimeToNow = (dueDate) => dayjs(dueDate).toNow(true);

const convertIntoHours = (mins) => {
  const hours = Math.floor(mins/MIN_PER_HOUR);
  const minutes = mins % MIN_PER_HOUR;
  return `${hours}h ${minutes}m`;
};

const sortDateDown = (taskA, taskB) => dayjs(taskB.filmInfo.release.date).diff(dayjs(taskA.filmInfo.release.date));
const sortRatingDown = (taskA, taskB) => taskB.filmInfo.totalRating-taskA.filmInfo.totalRating;

export {humanizeOnlyYear,humanizeWholeDate,calculateTimeToNow,convertIntoHours,getDeclension,sortDateDown,sortRatingDown};
