'use strict';
(function () {
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

  /**
   * Функция случайно сортировки массива
   * @param {array} incomingArray массив для сортировки
   * @return {array}
   */
  var sortRandom = function (incomingArray) {
    var j;
    var temp;
    for (var i = incomingArray.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = incomingArray[j];
      incomingArray[j] = incomingArray[i];
      incomingArray[i] = temp;
    }
    return incomingArray;
  };

  /**
   * Функция находит числовую разницу между значениями двух объектов
   * @param {object} pictureA
   * @param {object} pictureB
   * @return {number}
   */
  var maxToMin = function (pictureA, pictureB) {
    if (pictureB.comments.length - pictureA.comments.length === 0) {
      return pictureB.likes - pictureA.likes;
    }
    return pictureB.comments.length - pictureA.comments.length;
  };

  /**
   * Функция добавляет кнопке класс img-filters__button--active
   * @param {evt} evt
   */
  var activeButtonClass = function (evt) {
    Array.from(filtersContainer.querySelectorAll('.img-filters__button')).forEach(function (button) {
      button.classList.remove('img-filters__button--active');
    });
    evt.target.classList.add('img-filters__button--active');
  };

  var removeOldPictures = function () {
    var pictureArray = pictures.querySelectorAll('.picture');
    Array.from(pictureArray).forEach(function (picture) {
      picture.remove();
    });
  };

  var successPictureData = function (pictureData) {
    writeElements(pictureData, pictureTemplate);
    drawFragment(picturesList, fragment);

    document.querySelector('.img-filters').classList.remove('img-filters--inactive');

    popular.addEventListener('click', window.debounce(function (popularClickEvt) {
      removeOldPictures();
      writeElements(pictureData, pictureTemplate);
      drawFragment(picturesList, fragment);
      activeButtonClass(popularClickEvt);
    }));

    newPictures.addEventListener('click', window.debounce(function (newClickEvt) {
      var newPicturesArray = sortRandom(pictureData.slice()).slice(0, 10);
      removeOldPictures();
      writeElements(newPicturesArray, pictureTemplate);
      drawFragment(picturesList, fragment);
      activeButtonClass(newClickEvt);
    }));

    discussed.addEventListener('click', window.debounce(function (discussedClickEvt) {
      var discussedArray = pictureData.slice().sort(maxToMin);
      removeOldPictures();
      writeElements(discussedArray, pictureTemplate);
      drawFragment(picturesList, fragment);
      activeButtonClass(discussedClickEvt);
    }));
  };

  var errorPictureData = function (errorMessage) {
    errorPictureData.error = errorMessage;
  };

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  window.server.load(successPictureData, errorPictureData);

  var filtersContainer = document.querySelector('.img-filters__form');
  var popular = filtersContainer.querySelector('#filter-popular');
  var newPictures = filtersContainer.querySelector('#filter-new');
  var discussed = filtersContainer.querySelector('#filter-discussed');
  var pictures = document.querySelector('.pictures');
})();
