import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';
dayjs.extend(Duration);

const MIN_PER_HOUR=60;

const humanizeOnlyYear = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeWholeDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeWholeDateWithTime = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');

const convertIntoHours = (mins) => {
  const hours = Math.floor(mins/MIN_PER_HOUR);
  const minutes = mins % MIN_PER_HOUR;
  return `${hours}h ${minutes}m`;
};

const sortDateDown = (taskA, taskB) => dayjs(taskB.filmInfo.release.date).diff(dayjs(taskA.filmInfo.release.date));
const sortRatingDown = (taskA, taskB) => taskB.filmInfo.totalRating-taskA.filmInfo.totalRating;

export {humanizeOnlyYear,humanizeWholeDate,humanizeWholeDateWithTime,convertIntoHours,sortDateDown,sortRatingDown};
