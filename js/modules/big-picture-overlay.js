'use strict';
(function () {
  /**
   * Функция убирает класс hidden тега.
   * @function
   * @param {object} overlaySelector объект, у которого нужно убрать класс hidden.
   */
  var openBigPictureOverlay = function (overlaySelector) {
    overlaySelector.classList.remove('hidden');
  };
  /**
   * Функция добавляет класс hidden тегу.
   * @function
   * @param {object} overlaySelector объект, которому нужно добавить класс hidden.
   */
  var closeBigPictureOverlay = function (overlaySelector) {
    overlaySelector.classList.add('hidden');
  };
  /**
   * Функция удаляет событие.
   * @function
   * @param {func} clickHandlerName - удаляемое coбытие.
   */
  var removeBigPictureClickHandler = function (clickHandlerName) {
    document.removeEventListener('keydown', clickHandlerName);
  };
  /**
   * Функция создает обработчик событий для клавиши escape.
   * @function
   * @param {object} evt
   */
  /**
   * Функция добавляет событие.
   * @function
   * @param {func} clickHandlerName - добавляемое событие.
   */
  var addBigPictureClickHandler = function (clickHandlerName) {
    document.addEventListener('keydown', clickHandlerName);
  };
  /**
   * Функция создает обработчик событий для клавиши escape.
   * @function
   * @param {object} evt
   */
  var bigPictureEscClickHandler = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      closeBigPictureOverlay(bigPicture);
      removeBigPictureClickHandler(bigPictureEscClickHandler);
    }
  };
  /**
   * Функция создает обработчик событий для клавиши escape.
   * @function
   * @param {object} evt
   */
  var bigPictureEnterClickHandler = function (evt) {
    if (window.buttonCheck.enter(evt)) {
      fillBigPicture(getCurrentObject(window.mockData.objectsList, evt.target.children[0]));
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
   * Функция возвращает из входящего массива элемент, у которого id совпадает с id evt елемента
   * @param {array} dataArray массив с элементами
   * @param {object} eventAttribute evt
   * @return {object} элемент входящего массива, у которого id совпадает с id evt елемента
   */
  var getCurrentObject = function (dataArray, eventAttribute) {
    getCurrentObject.selected = dataArray.filter(function (arrayItem) {
      return arrayItem.id === eventAttribute.id;
    });
    return getCurrentObject.selected;
  };
  /**
   * Функция заполняет поля элемента big-picture.
   * @param {event} currentObject - входящий объект с данными
   */
  var fillBigPicture = function (currentObject) {
    openBigPictureOverlay(bigPicture);
    addBigPictureClickHandler(bigPictureEscClickHandler);
    renderBigPicture(currentObject[0], bigPicture);
    renderComment(currentObject[0], commentTemplate);
    deleteHtml(commentsList);
    drawFragment(commentsList, fragment);
  };
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
  var commentsList = bigPicture.querySelector('.social__comments');
  var fragment = document.createDocumentFragment();
  var picturesList = document.querySelector('.pictures');
  var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
  picturesList.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('picture__img')) {
      fillBigPicture(getCurrentObject(window.mockData.objectsList, evt.target));
    }
  });
  picturesList.addEventListener('keydown', function (evt) {
    if (evt.target.classList.contains('picture')) {
      bigPictureEnterClickHandler(evt);
    }
  });
  bigPictureCloseButton.addEventListener('click', function () {
    closeBigPictureOverlay(bigPicture);
    removeBigPictureClickHandler(bigPictureEscClickHandler);
  });
})();
