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

function getMaxElements(S) {
  const newMass = [];
  let maxComments = 0;
  let elMaxCom;

  for (let i = 0; i < S.length; i++) {
    if (S[i].comments.length > maxComments) {
      elMaxCom = S[i];
      maxComments=S[i].comments.length;
      newMass.push(elMaxCom);
    }
    else {
      if (S[i].comments.length === elMaxCom.comments.length) {
        newMass.push(S[i]);
      }
    }
  }
  return shuffle(newMass);
}

function shuffle(arr){
  let j, temp;
  for(let i = arr.length - 1; i > 0; i--){
    j = Math.floor(Math.random()*(i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

const sortDateDown = (taskA, taskB) => dayjs(taskB.filmInfo.release.date).diff(dayjs(taskA.filmInfo.release.date));
const sortRatingDown = (taskA, taskB) => taskB.filmInfo.totalRating-taskA.filmInfo.totalRating;
const sortCommentsDown = (taskA, taskB) => taskB.comments.length-taskA.comments.length;

export {humanizeOnlyYear,humanizeWholeDate,calculateTimeToNow,convertIntoHours,getDeclension,getMaxElements,shuffle,sortDateDown,sortRatingDown,sortCommentsDown};
