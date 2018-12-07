'use strict';
(function () {
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
      commentsTotal.push(commentsArray[window.getRandomNumber(minNumber, maxNumber) - 1]);
    }
    return commentsTotal;
  };
  /**
   * Функция создает объект и пушит его в массив arrayToInsert.
   * @function
   * @param {number} arrayElementNumber номер элемента в массиве.
   * @param {array} descriptionArray массив с описаниями для фото.
   * @return {object} новый объект.
   */
  var createObject = function (arrayElementNumber, descriptionArray) {
    var newObject = {
      url: 'photos/' + arrayElementNumber + '.jpg',
      id: 'img' + arrayElementNumber,
      likes: window.getRandomNumber(minLikes, maxLikes),
      comments: randomComments(testComments, window.getRandomNumber(minCommentsCount, maxCommentsCount)),
      description: descriptionArray[window.getRandomNumber(minNumber, maxNumber) - 1]
    };
    return newObject;
  };
  /**
   * Функция пушит объект в массив
   * @function
   * @param {object} newObject - объект, который будет запушен.
   * @param {array} arrayToInsert массив для вставки объекта.
   */
  var pushNewObject = function (newObject, arrayToInsert) {
    arrayToInsert.push(newObject);
  };
  /**
   * Функция создает массив объектов.
   * @function
   * @param {number} totalObjects всего объектов в массиве.
   * @param {array} descriptionArray массив с описаниями для фото.
   * @param {array} arrayToInsert массив для вставки объектов.
   */
  var createArray = function (totalObjects, descriptionArray, arrayToInsert) {
    for (var i = 1; i <= totalObjects; i++) {
      pushNewObject((createObject(i, descriptionArray)), arrayToInsert);
    }
  };
  /**
   * Функция генерирует dom-объект.
   * @function
   * @param  {object} templateElement темплейт для копирования.
   * @return {ActiveX.IXMLDOMNode | Node} возвращает ноду с разметкой.
   */
  var cloneElement = function (templateElement) {
    var clone = templateElement.cloneNode(true);
    return clone;
  };
  /**
   * Функция записывает в объект данные из массива.
   * @function
   * @param {Node} clone функция с template элементом.
   * @param {number} arrayElement элемент массива из которого берется информация.
   * @return {Node} элемент с заполненной разметкой.
   */
  var createPost = function (clone, arrayElement) {
    clone.querySelector('.picture__img').src = arrayElement.url;
    clone.querySelector('.picture__img').id = arrayElement.id;
    clone.querySelector('.picture__likes').textContent = arrayElement.likes;
    clone.querySelector('.picture__comments').textContent = arrayElement.comments.length;
    return clone;
  };
  /**
   * Функция записывает элементы в фрагмент.
   * @function
   * @param {array} userArray массив из которого берется информация.
   * @param {object} templateElement темплейт для копирования.
   */
  var writeElements = function (userArray, templateElement) {
    for (var i = 0; i < userArray.length; i++) {
      fragment.appendChild(createPost(cloneElement(templateElement), userArray[i]));
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
  var elementsInArrayQuantity = 25;
  var minNumber = 1;
  var maxNumber = 6;
  var minLikes = 15;
  var maxLikes = 200;
  var minCommentsCount = 1;
  var maxCommentsCount = 2;
  /**
   * Создаю массив из 25 объектов и рисую его в блоке .picture.
   */
  createArray(elementsInArrayQuantity, testDescriptions, objectsList);
  writeElements(objectsList, pictureTemplate);
  drawFragment(picturesList, fragment);
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');
  window.mockData = {
    objectsList: objectsList,
    testComments: testComments,
    testDescriptions: testDescriptions
  };
})();
