import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFractional = (a = 10, b = 100) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1))/10;
};

const makeUpperCaseFirst=(str)=> str[0].toUpperCase() + str.slice(1);


const humanizeOnlyYear = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeWholeDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeWholeDateWithTime = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortDateDown = (taskA, taskB) => dayjs(taskB.filmInfo.release.date).diff(dayjs(taskA.filmInfo.release.date));
const sortRatingDown = (taskA, taskB) => taskB.filmInfo.totalRating-taskA.filmInfo.totalRating;

export {getRandomInteger,getRandomFractional,makeUpperCaseFirst,humanizeOnlyYear,humanizeWholeDate,humanizeWholeDateWithTime,updateItem,sortDateDown,sortRatingDown};
