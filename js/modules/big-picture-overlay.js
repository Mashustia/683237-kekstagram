'use strict';
(function () {
  /**
   * Функция убирает класс hidden тега.
   * @function
   * @param {object} overlaySelector объект, у которого нужно убрать класс hidden.
   */
  var openEditingOverlay = function (overlaySelector) {
    overlaySelector.classList.remove('hidden');
    document.addEventListener('keydown', escClickHandler);
  };
  /**
   * Функция добавляет класс hidden тегу.
   * @function
   * @param {object} overlaySelector объект, которому нужно добавить класс hidden.
   */
  var closeEditingOverlay = function (overlaySelector) {
    overlaySelector.classList.add('hidden');
    document.removeEventListener('keydown', escClickHandler);
  };
  /**
   * Функция задает объекту значение '' (пустая строка).
   * @function
   * @param {object} uploadField задает объект, которому нужно присвоить пустую строку.
   */
  var clearInputValue = function (uploadField) {
    uploadField.value = '';
  };
  /**
   * Функция для закрытия формы редактирования изображения по клавише esc
   * @function
   * @param {event} evt - event
   */
  var escClickHandler = function (evt) {
    if (window.buttonCheck.escape(evt) === true) {
      closeEditingOverlay(imageEditingOverlay);
      clearInputValue(uploadFileField);
    }
  };




  /**
   * Функция убирает класс hidden тега.
   * @function
   * @param {object} overlaySelector объект, у которого нужно убрать класс hidden.
   */
  var openBigPictureOverlay = function (overlaySelector) {
    overlaySelector.classList.remove('hidden');
    document.addEventListener('keydown', bigPictureEscClickHandler);
  };
  /**
   * Функция создает обработчик событий для клавиши escape.
   * @function
   * @param {object} evt
   */
  var bigPictureEscClickHandler = function (evt) {
    if (window.buttonCheck.escape(evt) === true) {
      closeBigPictureOverlay(bigPicture);
    }
  };
  /**
   * Функция добавляет класс hidden тегу.
   * @function
   * @param {object} overlaySelector объект, которому нужно добавить класс hidden.
   */
  var closeBigPictureOverlay = function (overlaySelector) {
    overlaySelector.classList.add('hidden');
    document.removeEventListener('keydown', bigPictureEscClickHandler);
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
      commentItem.querySelector('.social__picture').src = 'img/avatar-' + window.getRandomNumber(1, 6) + '.svg';
      commentItem.querySelector('.social__text').textContent = arrayElement.comments[i];
      fragment.appendChild(commentItem);
    }
    return commentItem;
  };
  /**
   * Функция для удаления разметки
   * @function
   * @param {objeckt} place - объект, у которого нужно удалить разметку;
   */
  var deleteHtml = function (place) {
    place.innerHTML = '';
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
   * Функция создает обработчик событий для клавиши escape.
   * @function
   * @param {object} evt
   */
  var bigPictureEnterClickHandler = function (evt) {
    if (window.buttonCheck.enter(evt) === true) {
      fillBigPicture(evt);
    }
  };

  var getCurrentObject = function (dataArray, eventAttribute) {
    getCurrentObject.selected = dataArray.filter(function (arrayItem) {
      return arrayItem.id === eventAttribute.target.children[0].id;
    });
    return getCurrentObject.selected;
  };

  /**
   * Функция заполняет поля элемента big-picture.
   * @param {event} eventAttribute - входящее событие
   */
  var fillBigPicture = function (eventAttribute) {
    getCurrentObject(window.mockData.objectsList, eventAttribute);
    openBigPictureOverlay(bigPicture);
    renderBigPicture(getCurrentObject[0], bigPicture);
    renderComment(getCurrentObject[0], commentTemplate);
    deleteHtml(commentsList);
    drawFragment(commentsList, fragment);
    var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
    bigPictureCloseButton.addEventListener('click', function () {
      closeBigPictureOverlay(bigPicture);
    });
  };
  var uploadFileField = document.getElementById('upload-file');
  var imageEditingOverlay = document.querySelector('.img-upload__overlay');
  var closeButton = imageEditingOverlay.querySelector('.img-upload__cancel');
  var bigPicture = document.querySelector('.big-picture');
  //var sliderPin = document.querySelector('.effect-level__pin');

  //var imgPreviewWrapper = document.querySelector('.img-upload__preview');


  var fragment = document.createDocumentFragment();
  uploadFileField.addEventListener('change', function () {
    openEditingOverlay(imageEditingOverlay);
  });
  closeButton.addEventListener('click', function () {
    closeEditingOverlay(imageEditingOverlay);
    clearInputValue(uploadFileField);
  });

  var picturesList = document.querySelector('.pictures');
  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
  var commentsList = bigPicture.querySelector('.social__comments');
  picturesList.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      var currentObject = window.mockData.objectsList.filter(function (arrayObject) {
        return arrayObject.id === evt.target.id;
      });
      openBigPictureOverlay(bigPicture);
      renderBigPicture(currentObject[0], bigPicture);
      renderComment(currentObject[0], commentTemplate);
      deleteHtml(commentsList);
      drawFragment(commentsList, fragment);
      var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
      bigPictureCloseButton.addEventListener('click', function () {
        closeBigPictureOverlay(bigPicture);
      });
    }
  });
  picturesList.addEventListener('keydown', function (evt) {
    if (evt.target.classList.contains('picture')) {
      bigPictureEnterClickHandler(evt);
    }
  });
})();
