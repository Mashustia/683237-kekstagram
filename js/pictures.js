'use strict';
/**
 * Функция для генерации случайного числа в промежутке min, max.
 * @function
 * @param {number} min минимальное значение числа.
 * @param {number} max максимальное значение числа.
 * @return {number} случайное число.
 */
var getRandomArbitrary = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/**
 * Функция создает объект и пушит его в массив arrayToInsert.
 * @function
 * @param {number} arrayElementNumber номер элемента в массиве.
 * @param {array} arrayToInsert массив для вставки объекта.
 * @param {array} descriptionArray массив с описаниями для фото.
 */
var createObject = function (arrayElementNumber, arrayToInsert, descriptionArray) {
  var newObject = {
    url: 'photos/' + arrayElementNumber + '.jpg',
    likes: getRandomArbitrary(15, 200),
    comments: randomComments(testComments, getRandomArbitrary(1, 2)),
    description: descriptionArray[getRandomArbitrary(1, 6) - 1]
  };
  arrayToInsert.push(newObject);
};

/**
 * Функция для создания массива объектов.
 * @function
 * @param {number} totalObjects всего объектов в массиве.
 * @param {array} arrayToInsert массив для вставки объектов.
 * @param {array} descriptionArray массив с описаниями для фото.
 */
var createArray = function (totalObjects, arrayToInsert, descriptionArray) {
  for (var i = 1; i <= totalObjects; i++) {
    createObject(i, arrayToInsert, descriptionArray);
  }
};

/**
 * Функция создает массив случайных комментариев
 * @function
 * @param {array} commentsArray массив исходных комментариев
 * @param {number} commentsNumber количество требуемых комментариев
 * @return {Array} массив со случайными комментариями
 */
var randomComments = function (commentsArray, commentsNumber) {
  var commentsTotal = [];
  for (var i = 0; i < commentsNumber; i++) {
    commentsTotal.push(commentsArray[getRandomArbitrary(1, 6) - 1]);
  }
  return commentsTotal;
};

/**
 * Функция для генерации dom-объекта и записи в него данных из массива objectsList.
 * @function
 * @param {number} arrayElement элемент массива из которого берется информация.
 * @param {object} templateElement темплейт для копирования.
 * @return {Node} элемент списка с заполненной разметкой.
 */
var renderPicture = function (arrayElement, templateElement) {
  var pictureItem = templateElement.cloneNode(true);
  pictureItem.querySelector('.picture__img').src = arrayElement.url;
  pictureItem.querySelector('.picture__likes').textContent = arrayElement.likes;
  pictureItem.querySelector('.picture__comments').textContent = arrayElement.comments.length;
  return pictureItem;
};

/**
 * Функция записывает элементы в фрагмент.
 * @function
 * @param {array} userArray массив из которого берется информация.
 * @param {object} templateElement темплейт для копирования.
 */
var writeElements = function (userArray, templateElement) {
  for (var i = 0; i < userArray.length; i++) {
    fragment.appendChild(renderPicture(userArray[i], templateElement));
  }
};

/**
 * Функция рисует фрагмент в блоке.
 * @function
 * @param {object} place задает куда рисуем.
 * @param {object} fragmentParameter параметр содержащий фрагмент
 */
var drawFragment = function (place, fragmentParameter) {
  place.appendChild(fragmentParameter);
};

/**
 * Функция для заполнения big-picture.
 * @function
 * @param {array} userArray  массив из которого берется информация.
 * @param {object} placeToRender место для вставки даных
 */
var renderBigPicture = function (userArray, placeToRender) {
  placeToRender.querySelector('.big-picture__img').querySelector('img').src = userArray.url;
  placeToRender.querySelector('.likes-count').textContent = userArray.likes;
  placeToRender.querySelector('.comments-count').textContent = userArray.comments.length;
  placeToRender.querySelector('.social__caption').textContent = userArray.description;
};

/**
 * Функция для генерации dom-объекта и записи в него данных из входящего массива.
 * @function
 * @param {object} arrayElement элемент входящего массива.
 * @param {object} templateElement темплейт для копирования.
 * @return {Node} элемент списка с заполненной разметкой.
 */
var renderComment = function (arrayElement, templateElement) {
  for (var i = 0; i < arrayElement.comments.length; i++) {
    var commentItem = templateElement.cloneNode(true);
    commentItem.querySelector('.social__picture').src = 'img/avatar-' + getRandomArbitrary(1, 6) + '.svg';
    commentItem.querySelector('.social__text').textContent = arrayElement.comments[i];
    fragment.appendChild(commentItem);
  }
  return commentItem;
};

var testComments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var testDescriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var objectsList = [];
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();
var bigPicture = document.querySelector('.big-picture');
var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
var commentsList = bigPicture.querySelector('.social__comments');

/**
 * Создаю массив из 25 объектов и рисую его в блоке .picture.
 */
createArray(25, objectsList, testDescriptions);
writeElements(objectsList, pictureTemplate);
drawFragment(picturesList, fragment);

document.querySelector('.big-picture').classList.remove('hidden');
renderBigPicture(objectsList[0], bigPicture);
renderComment(objectsList[0], commentTemplate);
drawFragment(commentsList, fragment);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
