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

  var successPictureData = function (pictureData) {
    writeElements(pictureData, pictureTemplate);
    drawFragment(picturesList, fragment);
  };

  var errorPictureData = function (errorMessage) {
    errorPictureData.error = errorMessage;
  };

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  window.server.load(successPictureData, errorPictureData);
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');
})();
