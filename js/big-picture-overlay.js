'use strict';
(function () {
  var DEFAULT_COMMENTS_VALUE = 5;
  var NEXT_COMMENT_VALUE = 5;

  /**
   * Функция создает обработчик событий для клавиши escape.
   * @function
   * @param {object} evt
   */
  var bigPictureEscKeydownHandler = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      removeBigPictureClickHandlers();
    }
  };

  /**
   * Функция для заполнения big-picture.
   * @function
   * @param {array} picture объект, из которого берутся данные.
   */
  var renderBigPicture = function (picture) {
    image.src = picture.url;
    likes.textContent = picture.likes;
    commentsCount.textContent = picture.comments.length;
    imageCaption.textContent = picture.description;

    if (picture.comments.length < DEFAULT_COMMENTS_VALUE) {
      shownComments.textContent = picture.comments.length;
    } else {
      shownComments.textContent = DEFAULT_COMMENTS_VALUE;
    }
  };

  /**
   * Функция создает комментарии
   * @function
   * @param {array} picture - объект массива
   * @param {object} template
   */
  var renderComment = function (picture, template) {
    picture.comments.forEach(function (comment) {
      var commentItem = template.cloneNode(true);

      commentItem.querySelector('.social__picture').src = comment.avatar;
      commentItem.querySelector('.social__text').textContent = comment.message;

      fragment.appendChild(commentItem);
    });
  };

  /**
   * Функция возвращает из массива pictures элемент, у которого url совпадает с url evt елемента
   * @param {array} pictures массив с элементами
   * @param {object} pictureUrl evt
   * @return {object} элемент массива pictures, у которого url совпадает с url evt елемента
   */
  var getCurrentPicture = function (pictures, pictureUrl) {
    var currentObject = pictures.find(function (picture) {
      return picture.url === pictureUrl;
    });

    return currentObject;
  };

  /**
   * Функция заполняет поля элемента big-picture.
   * @param {event} currentPicture - выбранный элемент массива pictures
   */
  var fillBigPicture = function (currentPicture) {
    if (!currentPicture) {
      return;
    }

    bigPicture.classList.remove('hidden');
    body.classList.add('modal-open');

    renderBigPicture(currentPicture);
    renderComment(currentPicture, commentTemplate);

    commentsList.innerHTML = '';

    commentsList.appendChild(fragment);

    hideComments();

    likes.focus();

    document.addEventListener('keydown', bigPictureEscKeydownHandler);

    closeButton.addEventListener('click', closeButtonClickHandler);
    bigPicture.addEventListener('click', bigPictureOverlayClickHandler);
    commentsLoader.addEventListener('click', commentsLoaderClickHandler);
  };

  /**
   * Слушатель события click на кнопке закрытия big-picture
   * @function
   */
  var closeButtonClickHandler = function () {
    removeBigPictureClickHandlers();
  };

  /**
   * Слушатель события click на оверлее big-picture
   * @function
   * @param {event} evt
   */
  var bigPictureOverlayClickHandler = function (evt) {
    if (evt.target.classList.contains('big-picture')) {
      removeBigPictureClickHandlers();
    }
  };

  /**
   * Функция удаляет слушатели события для big-picture
   * @function
   */
  var removeBigPictureClickHandlers = function () {
    bigPicture.classList.add('hidden');
    commentsLoader.classList.remove('hidden');
    body.removeAttribute('class');

    document.removeEventListener('keydown', bigPictureEscKeydownHandler);
    bigPicture.removeEventListener('click', bigPictureOverlayClickHandler);
    commentsLoader.removeEventListener('click', commentsLoaderClickHandler);
    closeButton.removeEventListener('click', closeButtonClickHandler);

    activePicture.focus();
  };

  /**
   * Функция открывает комментарии по клику на .comments-loader
   * @function
   */
  var loadComments = function () {
    var comments = bigPicture.querySelectorAll('.social__comment');
    var commentsShown = bigPicture.querySelector('.comments-count--shown');
    var count = parseInt(commentsShown.textContent, 10) + NEXT_COMMENT_VALUE;

    if (count >= comments.length) {
      count = comments.length;
      commentsLoader.classList.add('hidden');
    }

    Array.from(comments).slice(commentsShown.textContent, count).forEach(function (comment) {
      comment.removeAttribute('style');
    });

    commentsShown.textContent = count;
  };

  /**
   * Слушаетль события click для .comments-loader
   * @function
   */
  var commentsLoaderClickHandler = function () {
    loadComments();
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
  var image = bigPicture.querySelector('.big-picture__img img');
  var likes = bigPicture.querySelector('.likes-count');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var imageCaption = bigPicture.querySelector('.social__caption');
  var shownComments = bigPicture.querySelector('.comments-count--shown');
  var closeButton = bigPicture.querySelector('.big-picture__cancel');
  var commentsList = bigPicture.querySelector('.social__comments');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var fragment = document.createDocumentFragment();
  var picturesContainer = document.querySelector('.pictures');
  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
  var body = document.querySelector('body');
  var activePicture = {};

  picturesContainer.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      var currentPicture = getCurrentPicture(window.pictures.data, evt.target.attributes.src.nodeValue);

      fillBigPicture(currentPicture);

      activePicture = evt.target.parentNode;
    }
  });

  picturesContainer.addEventListener('keydown', function (evt) {
    if (evt.target.classList.contains('picture') && window.buttonCheck.enter(evt)) {
      var currentPicture = getCurrentPicture(window.pictures.data, evt.target.children[0].attributes.src.nodeValue);

      fillBigPicture(currentPicture);

      activePicture = evt.target;
    }
  });
})();
