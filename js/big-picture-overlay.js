'use strict';
(function () {
  var DEFAULT_COMMENTS_VALUE = '5';
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
      fillBigPicture(getCurrentObject(pictureDataList, evt.target.children[0].attributes.src.nodeValue));
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
    if (userArray.comments.length < 5) {
      placeToRender.querySelector('.comments-count--shown').textContent = userArray.comments.length;
    } else {
      placeToRender.querySelector('.comments-count--shown').textContent = DEFAULT_COMMENTS_VALUE;
    }
  };

  /**
   * Функция создает комментарии
   * @function
   * @param {array} arrayParametr
   * @param {object} templateElement
   */
  var renderComment = function (arrayParametr, templateElement) {
    arrayParametr.comments.forEach(function (comment) {
      var commentItem = templateElement.cloneNode(true);
      commentItem.querySelector('.social__picture').src = comment.avatar;
      commentItem.querySelector('.social__text').textContent = comment.message;
      fragment.appendChild(commentItem);
    });
  };

  /**
   * Функция возвращает из входящего массива элемент, у которого id совпадает с id evt елемента
   * @param {array} dataArray массив с элементами
   * @param {object} eventAttribute evt
   * @return {object} элемент входящего массива, у которого id совпадает с id evt елемента
   */
  var getCurrentObject = function (dataArray, eventAttribute) {
    var currentObject = dataArray.filter(function (arrayItem) {
      return arrayItem.url === eventAttribute;
    });
    return currentObject;
  };

  /**
   * Функция заполняет поля элемента big-picture.
   * @param {event} currentObject - входящий объект с данными
   */
  var fillBigPicture = function (currentObject) {
    bigPicture.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', bigPictureEscClickHandler);
    renderBigPicture(currentObject[0], bigPicture);
    renderComment(currentObject[0], commentTemplate);
    commentsList.innerHTML = '';
    commentsList.appendChild(fragment);
  };

  /**
   * Функция выполняется в случае успешной загрузки данных с сервера
   * @function
   * @param {array} pictureData
   */
  var onLoad = function (pictureData) {
    pictureDataList = pictureData;
  };

  /**
   * Функция выполняется в случае ошибки загрузки данных с сервера
   * @function
   * @param {string/object} errorMessage
   * @return {boolean} true/false
   */
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
    commentsLoader.classList.remove('hidden');
    body.removeAttribute('class');
    document.removeEventListener('keydown', bigPictureEscClickHandler);
    bigPicture.removeEventListener('click', bigPictureOverlayClickHandler);
    commentsLoader.removeEventListener('click', commentsLoaderClickHandler);
  };

  /**
   * Функция открывает комментарии по клику на .comments-loader
   * @function
   */
  var commentsLoaderClickHandler = function () {
    var comments = bigPicture.querySelectorAll('.social__comment');
    var commentsShown = bigPicture.querySelector('.comments-count--shown');
    var commentsCount = parseInt(commentsShown.textContent, 10) + 5;
    if (commentsCount >= comments.length) {
      commentsCount = comments.length;
      commentsLoader.classList.add('hidden');
    }
    Array.from(comments).slice(commentsShown.textContent, commentsCount).forEach(function (comment) {
      comment.removeAttribute('style');
    });
    commentsShown.textContent = commentsCount;
  };

  /**
   * Функция скрывает комментарии после DEFAULT_COMMENTS_VALUE
   * @function
   */
  var hideComments = function () {
    var comments = bigPicture.querySelectorAll('.social__comment');
    Array.from(comments).slice(DEFAULT_COMMENTS_VALUE).forEach(function (comment) {
      comment.style.display = 'none';
    });
    if (comments.length <= DEFAULT_COMMENTS_VALUE) {
      commentsLoader.classList.add('hidden');
    }
  };

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
  var commentsList = bigPicture.querySelector('.social__comments');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var fragment = document.createDocumentFragment();
  var picturesList = document.querySelector('.pictures');
  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
  var pictureDataList = {};
  var body = document.querySelector('body');

  window.server.load(onLoad, onError);

  picturesList.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      fillBigPicture(getCurrentObject(pictureDataList, evt.target.attributes.src.nodeValue));
      bigPictureCloseButton.addEventListener('click', bigPictureCloseButtonClickHandler, {once: true});
      bigPicture.addEventListener('click', bigPictureOverlayClickHandler);
      hideComments();
      commentsLoader.addEventListener('click', commentsLoaderClickHandler);
    }
  });

  picturesList.addEventListener('keydown', function (evt) {
    if (evt.target.classList.contains('picture') && window.buttonCheck.enter(evt)) {
      bigPictureEnterClickHandler(evt);
      bigPictureCloseButton.addEventListener('click', bigPictureCloseButtonClickHandler, {once: true});
      bigPicture.addEventListener('click', bigPictureOverlayClickHandler);
      hideComments();
      commentsLoader.addEventListener('click', commentsLoaderClickHandler);
    }
  });
})();
