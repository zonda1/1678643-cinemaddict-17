// import {getRandomInteger,getRandomFractional} from '../utils';
// import {nanoid} from 'nanoid';
// import { EMOTIONS } from '../const/const';

// const generateDescription = () => {
//   const descriptions = [
//     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. ',
//     'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
//     'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
//   ];

//   const randomIndex = getRandomInteger(0, descriptions.length - 1);

//   return descriptions[randomIndex];
// };

// const filmTitleToUrl={
//   'Made for each other': './images/posters/made-for-each-other.png',
//   'Popeye meets sinbad':'./images/posters/popeye-meets-sinbad.png',
//   'Sagebrush trail':'./images/posters/sagebrush-trail.jpg',
//   'Santa claus conquers the martians':'./images/posters/santa-claus-conquers-the-martians.jpg',
//   'The dance of life':'./images/posters/the-dance-of-life.jpg',
//   'The great flamarion':'./images/posters/the-great-flamarion.jpg',
//   'The man with the golden arm':'./images/posters/the-man-with-the-golden-arm.jpg',
// };

// const generateFilmTitles = () => {
//   const titles = Object.keys(filmTitleToUrl);

//   const randomIndex = getRandomInteger(0, titles.length - 1);
//   return titles[randomIndex];
// };

// const getRandomEmotion = () => {
//   const randomIndex = getRandomInteger(0, EMOTIONS.length - 1);

//   return EMOTIONS[randomIndex];
// };


// export const generateFilmFeature = () => {
//   const generatedFilmTitle=generateFilmTitles();

//   return ({
//     id:nanoid(),
//     filmInfo: {
//       title:generatedFilmTitle,
//       alternativeTitle: 'Laziness Who Sold Themselves',
//       totalRating: getRandomFractional(),
//       posters: filmTitleToUrl[generatedFilmTitle],
//       ageRating: 0,
//       director: 'Tom Ford',
//       writers: [
//         'Takeshi Kitano'
//       ],
//       actors: [
//         'Morgan Freeman'
//       ],
//       release: {
//         date: `${getRandomInteger(1950,2022)}-05-11T00:00:00.000Z`,
//         releaseCountry: 'Finland'
//       },
//       runtime: 77,
//       genre: [
//         'Comedy'
//       ],
//       description: generateDescription(),
//     },
//     userDetails: {
//       watchlist: false,
//       alreadyWatched: true,
//       watchingDate: '2019-04-12T16:12:32.554Z',
//       favorite: false
//     }
//   });};

// export const generateFilmComments = (filmId) => ({
//   id: filmId,
//   // eslint-disable-next-line quotes
//   author: `Ilya O'Reilly`,
//   comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
//   date: '2019-05-11T16:12:32.554Z',
//   emotion: getRandomEmotion()
// });

