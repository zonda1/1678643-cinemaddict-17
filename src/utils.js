import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

export {getRandomInteger, humanizeOnlyYear,humanizeWholeDate,humanizeWholeDateWithTime,updateItem};
