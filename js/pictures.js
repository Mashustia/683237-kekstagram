'use strict';
(function () {
  /**
   * Функция записывает в объект данные из массива.
   * @function
   * @param {Node} pictureTemplate template для картинки.
   * @param {number} picture элемент массива из которого берется информация о кратинке.
   * @return {Node} элемент с заполненной разметкой.
   */
  var fillPicture = function (pictureTemplate, picture) {
    pictureTemplate.querySelector('.picture__img').src = picture.url;
    pictureTemplate.querySelector('.picture__likes').textContent = picture.likes;
    pictureTemplate.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureTemplate;
  };

  /**
   * Функция записывает элементы в фрагмент.
   * @function
   * @param {array} pictures массив из которого берется информация.
   * @param {object} pictureTemplate темплейт для picture.
   */
  var writeElements = function (pictures, pictureTemplate) {
    pictures.forEach(function (picture) {
      fragment.appendChild(fillPicture(pictureTemplate.cloneNode(true), picture));
    });
  };

  /**
   * Функция случайной сортировки массива
   * @function
   * @param {array} dataArray массив для сортировки
   * @return {array} возвращает массив в котором элементы расположены в случайном порядке
   */
  var sortRandom = function (dataArray) {
    var randomIndex;
    var temp;

    for (var i = dataArray.length - 1; i > 0; i--) {
      randomIndex = Math.floor(Math.random() * (i + 1));
      temp = dataArray[randomIndex];
      dataArray[randomIndex] = dataArray[i];
      dataArray[i] = temp;
    }

    return dataArray;
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
   * Функция создает список картинок
   * @function
   * @param {array} pictures массив с данными о фотографиях, которые необходимо отрисовать
   * @param {event} button активная кнопка
   */
  var createImages = function (pictures, button) {
    removeOldPictures();
    writeElements(pictures, pictureTemplate);
    picturesContainer.appendChild(fragment);
    addActiveButtonClass(button);
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
   * @param {array} pictures массив с данными о фотографиях с сервера.
   */
  var successPictures = function (pictures) {
    var popular = filtersContainer.querySelector('#filter-popular');
    var newPictures = filtersContainer.querySelector('#filter-new');
    var discussed = filtersContainer.querySelector('#filter-discussed');

    pictureData = pictures;

    window.pictures = {
      data: pictureData
    };

    writeElements(pictures, pictureTemplate);
    picturesContainer.appendChild(fragment);

    popular.addEventListener('click', window.debounce(function (popularEvt) {
      createImages(pictures, popularEvt);
    }));

    newPictures.addEventListener('click', window.debounce(function (newEvt) {
      var newPicturesArray = sortRandom(pictures.slice()).slice(0, 10);
      createImages(newPicturesArray, newEvt);
    }));

    discussed.addEventListener('click', window.debounce(function (discussedEvt) {
      var discussedArray = pictures.slice().sort(maxToMin);
      createImages(discussedArray, discussedEvt);
    }));
  };

  /**
   * Функция выполняется в случае ошибки получения данных с сервера
   * @function
   * @param {string/object} errorMessage
   */
  var errorPictures = function (errorMessage) {
    errorPictures.error = errorMessage;
  };

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesContainer = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var filtersContainer = document.querySelector('.img-filters__form');
  var pictureData = {};

  window.server.load(successPictures, errorPictures);

  window.onload = checkImageLoading;

  // window.pictures = {
  //   data: pictureData
  // };
})();
