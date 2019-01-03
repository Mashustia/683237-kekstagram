'use strict';
(function () {
  /**
   * Функция генерирует dom-объект.
   * @function
   * @param  {object} templateElement темплейт для копирования.
   * @return {ActiveX.IXMLDOMNode | Node} возвращает ноду с разметкой.
   */
  var cloneElement = function (templateElement) {
    return templateElement.cloneNode(true);
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
    userArray.forEach(function (arrayEl) {
      fragment.appendChild(createPost(cloneElement(templateElement), arrayEl));
    });
  };

  /**
   * Функция рисует фрагмент в блоке.
   * @function
   * @param {object} place задает куда рисуем.
   * @param {object} fragment параметр содержащий фрагмент
   */
  var drawFragment = function (place, fragment) {
    place.appendChild(fragment);
  };

  /**
   * Функция случайной сортировки массива
   * @function
   * @param {array} incomingArray массив для сортировки
   * @return {array} возвращает массив в котором элементы расположены в случайном порядке
   */
  var sortRandom = function (incomingArray) {
    var randomIndex;
    var temp;

    for (var i = incomingArray.length - 1; i > 0; i--) {
      randomIndex = Math.floor(Math.random() * (i + 1));
      temp = incomingArray[randomIndex];
      incomingArray[randomIndex] = incomingArray[i];
      incomingArray[i] = temp;
    }

    return incomingArray;
  };

  /**
   * Функция находит числовую разницу между значениями двух объектов
   * @function
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
   * @function
   * @param {event} evt
   */
  var addActiveButtonClass = function (evt) {
    filtersContainer.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    evt.target.classList.add('img-filters__button--active');
  };

  /**
   * Функция удаляет из разметки фотографии .picture
   * @function
   */
  var removeOldPictures = function () {
    var pictureArray = document.querySelectorAll('.picture');

    Array.from(pictureArray).forEach(function (picture) {
      picture.remove();
    });
  };

  /**
   * Функция фильтрует изображения согласно входящим параметрам
   * @function
   * @param {array} picturesArray массив с данными о фотографиях, которые необходимо отрисовать
   * @param {event} evt событие
   */
  var filterImage = function (picturesArray, evt) {
    removeOldPictures();
    writeElements(picturesArray, pictureTemplate);
    drawFragment(picturesContainer, fragment);
    addActiveButtonClass(evt);
  };

  /**
   * Функция показывает блок .img-filters
   * @function
   */
  var checkImageLoading = function () {
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  /**
   * Функция выполняется, если данные с сервера получены успешно.
   * @function
   * @param {array} pictureData массив с данными о фотографиях с сервера.
   */
  var successPictureData = function (pictureData) {
    var popular = filtersContainer.querySelector('#filter-popular');
    var newPictures = filtersContainer.querySelector('#filter-new');
    var discussed = filtersContainer.querySelector('#filter-discussed');

    writeElements(pictureData, pictureTemplate);
    drawFragment(picturesContainer, fragment);

    popular.addEventListener('click', window.debounce(function (popularClickEvt) {
      filterImage(pictureData, popularClickEvt);
    }));

    newPictures.addEventListener('click', window.debounce(function (newClickEvt) {
      var newPicturesArray = sortRandom(pictureData.slice()).slice(0, 10);
      filterImage(newPicturesArray, newClickEvt);
    }));

    discussed.addEventListener('click', window.debounce(function (discussedClickEvt) {
      var discussedArray = pictureData.slice().sort(maxToMin);
      filterImage(discussedArray, discussedClickEvt);
    }));
  };

  /**
   * Функция выполняется в случае ошибки получения данных с сервера
   * @function
   * @param {string/object} errorMessage
   */
  var errorPictureData = function (errorMessage) {
    errorPictureData.error = errorMessage;
  };

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesContainer = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var filtersContainer = document.querySelector('.img-filters__form');

  window.server.load(successPictureData, errorPictureData);

  window.onload = checkImageLoading;
})();
