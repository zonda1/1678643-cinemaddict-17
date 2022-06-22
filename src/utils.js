import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';
dayjs.extend(Duration);

const humanizeOnlyYear = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeWholeDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeWholeDateWithTime = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');

const convertIntoHours = (mins) => {
  const hours = Math.floor(mins/60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
};

const sortDateDown = (taskA, taskB) => dayjs(taskB.filmInfo.release.date).diff(dayjs(taskA.filmInfo.release.date));
const sortRatingDown = (taskA, taskB) => taskB.filmInfo.totalRating-taskA.filmInfo.totalRating;

export {humanizeOnlyYear,humanizeWholeDate,humanizeWholeDateWithTime,convertIntoHours,sortDateDown,sortRatingDown};
