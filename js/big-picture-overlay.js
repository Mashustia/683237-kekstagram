'use strict';
(function () {
  var SERVER_ADDRESS_LENGTH = 34;

  /**
   * Функция создает обработчик событий для клавиши escape.
   * @function
   * @param {object} evt
   */
  var bigPictureEscClickHandler = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      removeBigPictureClickHandlers();
    }
  };

  /**
   * Функция создает обработчик событий для клавиши enter.
   * @function
   * @param {object} evt
   */
  var bigPictureEnterClickHandler = function (evt) {
    if (window.buttonCheck.enter(evt)) {
      fillBigPicture(getCurrentObject(pictureDataList, evt.target.children[0].src.slice(SERVER_ADDRESS_LENGTH)));
    }
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

  var renderComment = function (arrayElement, templateElement) {
    for (var i = 0; i < arrayElement.comments.length; i++) {
      var commentItem = templateElement.cloneNode(true);
      commentItem.querySelector('.social__picture').src = arrayElement.comments[i].avatar;
      commentItem.querySelector('.social__text').textContent = arrayElement.comments[i].message;
      fragment.appendChild(commentItem);
    }
    return commentItem;
  };

  /**
   * Функция возвращает из входящего массива элемент, у которого id совпадает с id evt елемента
   * @param {array} dataArray массив с элементами
   * @param {object} eventAttribute evt
   * @return {object} элемент входящего массива, у которого id совпадает с id evt елемента
   */
  var getCurrentObject = function (dataArray, eventAttribute) {
    getCurrentObject.selected = dataArray.filter(function (arrayItem) {
      return arrayItem.url === eventAttribute;
    });
    return getCurrentObject.selected;
  };

  /**
   * Функция заполняет поля элемента big-picture.
   * @param {event} currentObject - входящий объект с данными
   */
  var fillBigPicture = function (currentObject) {
    bigPicture.classList.remove('hidden');
    document.addEventListener('keydown', bigPictureEscClickHandler);
    renderBigPicture(currentObject[0], bigPicture);
    renderComment(currentObject[0], commentTemplate);
    commentsList.innerHTML = '';
    commentsList.appendChild(fragment);
  };

  var onLoad = function (pictureData) {
    pictureDataList = pictureData;
  };

  var onError = function (errorMessage) {
    if (errorMessage) {
      return false;
    }
    return true;
  };

  var bigPictureCloseButtonClickHandler = function () {
    removeBigPictureClickHandlers();
  };

  var bigPictureOverlayClickHandler = function (bigPictureOverlayClickEvt) {
    if (bigPictureOverlayClickEvt.target.classList.contains('big-picture')) {
      removeBigPictureClickHandlers();
    }
  };

  var removeBigPictureClickHandlers = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', bigPictureEscClickHandler);
    bigPicture.removeEventListener('click', bigPictureOverlayClickHandler);
  };

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();
  var picturesList = document.querySelector('.pictures');
  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
  var pictureDataList = {};

  window.server.load(onLoad, onError);

  picturesList.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      fillBigPicture(getCurrentObject(pictureDataList, evt.target.src.slice(SERVER_ADDRESS_LENGTH)));
      bigPictureCloseButton.addEventListener('click', bigPictureCloseButtonClickHandler, {once: true});
      bigPicture.addEventListener('click', bigPictureOverlayClickHandler);
    }
  });

  picturesList.addEventListener('keydown', function (evt) {
    if (evt.target.classList.contains('picture')) {
      bigPictureEnterClickHandler(evt);
      bigPictureCloseButton.addEventListener('click', bigPictureCloseButtonClickHandler, {once: true});
      bigPicture.addEventListener('click', bigPictureOverlayClickHandler);
    }
  });
})();
