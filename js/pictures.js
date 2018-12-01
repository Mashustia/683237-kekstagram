'use strict';
/**
 * Функция для генерации случайного числа в промежутке min, max.
 * @function
 * @param {number} min минимальное значение числа.
 * @param {number} max максимальное значение числа.
 * @return {number} случайное число.
 */
var getRandomArbitrary = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

/**
 * Универсальная функция для добавления класса
 * @function
 * @param {object} placeToAdd - аргумент, которому нужно добавить класс.
 * @param {object} newClass класс, который нужно добавить
 */
var addСlassThisElement = function (placeToAdd, newClass) {
  placeToAdd.classList.add(newClass);
};

/**
 * Функция для удаления атрибута тега
 * @param {object} checkedArgument тег, у которого будет удаляться атрибут
 * @param {string} removedAttribute атрибут, который нужно удалить
 */
var removeNecessaryAttribute = function (checkedArgument, removedAttribute) {
  checkedArgument.removeAttribute(removedAttribute);
};

/**
 * Функция создает объект и пушит его в массив arrayToInsert.
 * @function
 * @param {number} arrayElementNumber номер элемента в массиве.
 * @param {array} arrayToInsert массив для вставки объекта.
 * @param {array} descriptionArray массив с описаниями для фото.
 */
var createObject = function (arrayElementNumber, arrayToInsert, descriptionArray) {
  var newObject = {
    url: 'photos/' + arrayElementNumber + '.jpg',
    id: 'img' + arrayElementNumber,
    likes: getRandomArbitrary(15, 200),
    comments: randomComments(testComments, getRandomArbitrary(1, 2)),
    description: descriptionArray[getRandomArbitrary(1, 6) - 1]
  };
  arrayToInsert.push(newObject);
};

/**
 * Функция для создания массива объектов.
 * @function
 * @param {number} totalObjects всего объектов в массиве.
 * @param {array} arrayToInsert массив для вставки объектов.
 * @param {array} descriptionArray массив с описаниями для фото.
 */
var createArray = function (totalObjects, arrayToInsert, descriptionArray) {
  for (var i = 1; i <= totalObjects; i++) {
    createObject(i, arrayToInsert, descriptionArray);
  }
};

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
    commentsTotal.push(commentsArray[getRandomArbitrary(minNumber, maxNumber) - 1]);
  }
  return commentsTotal;
};

/**
 * Функция для генерации dom-объекта и записи в него данных из массива objectsList.
 * @function
 * @param {number} arrayElement элемент массива из которого берется информация.
 * @param {object} templateElement темплейт для копирования.
 * @return {Node} элемент списка с заполненной разметкой.
 */
var renderPicture = function (arrayElement, templateElement) {
  var pictureItem = templateElement.cloneNode(true);
  pictureItem.querySelector('.picture__img').src = arrayElement.url;
  pictureItem.querySelector('.picture__img').id = arrayElement.id;
  pictureItem.querySelector('.picture__likes').textContent = arrayElement.likes;
  pictureItem.querySelector('.picture__comments').textContent = arrayElement.comments.length;
  return pictureItem;
};

/**
 * Функция записывает элементы в фрагмент.
 * @function
 * @param {array} userArray массив из которого берется информация.
 * @param {object} templateElement темплейт для копирования.
 */
var writeElements = function (userArray, templateElement) {
  for (var i = 0; i < userArray.length; i++) {
    fragment.appendChild(renderPicture(userArray[i], templateElement));
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
    commentItem.querySelector('.social__picture').src = 'img/avatar-' + getRandomArbitrary(1, 6) + '.svg';
    commentItem.querySelector('.social__text').textContent = arrayElement.comments[i];
    fragment.appendChild(commentItem);
  }
  return commentItem;
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
var bigPicture = document.querySelector('.big-picture');
var commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment');
var commentsList = bigPicture.querySelector('.social__comments');
var elementsInArrayQuantity = 25;
var minNumber = 1;
var maxNumber = 6;

/**
 * Создаю массив из 25 объектов и рисую его в блоке .picture.
 */
createArray(elementsInArrayQuantity, objectsList, testDescriptions);
writeElements(objectsList, pictureTemplate);
drawFragment(picturesList, fragment);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

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
  if (evt.code === ESC_CODE) {
    closeEditingOverlay(imageEditingOverlay);
    clearInputValue(uploadFileField);
  }
};

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
 * Функция для определения координат контейнера.
 * @function
 * @param {object} elem контейнер для которого нужны координаты.
 * @return {number} возвращает координату контейнера по X
 */
var getLeftCoords = function (elem) {
  var box = elem.getBoundingClientRect();
  return box.left + pageXOffset;
};

/**
 * Функция рассчитывает интенсивность эффекта (Хром, Сепия, Фобос...) в зависимости от положения пина.
 * @function
 * @param {object} startingCoordinate координата пина на нуле.
 * @param {object} clickPoint задает event.
 * @return {number} возвращает интенсивность фильтра от 0 до 100.
 */
var getPinPoint = function (startingCoordinate, clickPoint) {
  var effectLevelLineWidth = 453;
  var oneHundred = 100;
  var effectSaturation = (clickPoint.clientX - startingCoordinate) * oneHundred / effectLevelLineWidth;
  if (effectSaturation < 0) {
    effectSaturation = 0;
  }
  if (effectSaturation > 100) {
    effectSaturation = 100;
  }
  return effectSaturation;
};

/**
 * Функция переводит интенсивность фильтра в требуемые единицы
 * @function
 * @param {object} checkedArgument параметр, класс которого проверяем.
 */
var addFilterNone = function (checkedArgument) {
  if (checkedArgument.className === 'effects__preview--none') {
    // нет кода
  }
};

/**
 * Функция переводит интенсивность фильтра в требуемые единицы и добавляет фильтр на картинку
 * Фильтр - Хром.
 * @function
 * @param {number} PinPointValue интенсивность фильтра от 0 до 100.
 * @param {object} checkedArgument параметр, класс которого проверяем.
 */
var addFilterChrome = function (PinPointValue, checkedArgument) {
  if (checkedArgument.className === 'effects__preview--chrome') {
    var grayscaleParametr = PinPointValue / 100;
    checkedArgument.style.filter = 'grayscale(' + grayscaleParametr + ')';
  }
};

/**
 * Функция переводит интенсивность фильтра в требуемые единицы и добавляет фильтр на картинку
 * Фильтр - Сепия.
 * @function
 * @param {number} PinPointValue интенсивность фильтра от 0 до 100.
 * @param {object} checkedArgument параметр, класс которого проверяем.
 */
var addFilterSepia = function (PinPointValue, checkedArgument) {
  if (checkedArgument.className === 'effects__preview--sepia') {
    var sepiaParametr = PinPointValue / 100;
    checkedArgument.style.filter = 'sepia(' + sepiaParametr + ')';
  }
};

/**
 * Функция переводит интенсивность фильтра в требуемые единицы и добавляет фильтр на картинку
 * Фильтр - Марвин.
 * @function
 * @param {number} PinPointValue интенсивность фильтра от 0 до 100.
 * @param {object} checkedArgument параметр, класс которого проверяем.
 */
var addFilterMarvin = function (PinPointValue, checkedArgument) {
  if (checkedArgument.className === 'effects__preview--marvin') {
    checkedArgument.style.filter = 'invert(' + PinPointValue + '%' + ')';
  }
};

/**
 * Функция переводит интенсивность фильтра в требуемые единицы и добавляет фильтр на картинку
 * Фильтр - Фобос.
 * @function
 * @param {number} PinPointValue интенсивность фильтра от 0 до 100.
 * @param {object} checkedArgument параметр, класс которого проверяем.
 */
var addFilterPhobos = function (PinPointValue, checkedArgument) {
  if (checkedArgument.className === 'effects__preview--phobos') {
    var phobosParametr = PinPointValue * 0.05;
    checkedArgument.style.filter = 'blur(' + phobosParametr + 'px' + ')';
  }
};

/**
 * Функция переводит интенсивность фильтра в требуемые единицы и добавляет фильтр на картинку
 * Фильтр - Зной.
 * @function
 * @param {number} PinPointValue интенсивность фильтра от 0 до 100.
 * @param {object} checkedArgument параметр, класс которого проверяем.
 */
var addFilterHeat = function (PinPointValue, checkedArgument) {
  if (checkedArgument.className === 'effects__preview--heat') {
    var heatParametr = PinPointValue * 0.03;
    checkedArgument.style.filter = 'brightness(' + heatParametr + ')';
  }
};

/**
 * Функция скрывает слайдер для effects__preview--none.
 * @function
 * @param {object} checkedArgument параметр, класс которого проверяем.
 * @param {object} mustBeHidden параметр, который должен быть скрыт.
 */
var hideEffectsNoneSlider = function (checkedArgument, mustBeHidden) {
  if (checkedArgument.classList.contains('effects__preview--none')) {
    mustBeHidden.classList.add('hidden');
  } else {
    mustBeHidden.classList.remove('hidden');
  }
};

/**
 * Функция создает обработчик событий для клавиши escape.
 * @function
 * @param {object} evt
 */
var bigPictureEscClickHandler = function (evt) {
  if (evt.code === ESC_CODE) {
    closeBigPictureOverlay(bigPicture);
  }
};

/**
 * Функция создает обработчик событий для клавиши escape.
 * @function
 * @param {object} evt
 */
var bigPictureEnterClickHandler = function (evt) {
  if (evt.code === ENTER_CODE) {
    fillBigPicture(evt);
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
 * Функция добавляет класс hidden тегу.
 * @function
 * @param {object} overlaySelector объект, которому нужно добавить класс hidden.
 */
var closeBigPictureOverlay = function (overlaySelector) {
  overlaySelector.classList.add('hidden');
  document.removeEventListener('keydown', bigPictureEscClickHandler);
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
 * Функция обрезает id элемента так, как нужно.
 * @function
 * @param {event} checkedEvent проверяемый элемент.
 * @return {string} возвращает измененный id.
 */
var sliceIdName = function (checkedEvent) {
  return checkedEvent.target.id.slice(0, 6) + 's__preview--' + checkedEvent.target.id.slice(7);
};

/**
 * Функция сбрасывает имя класса до пустой строки ('').
 * @function
 * @param {object} resetArgument элемент, которому сбрасывается класс
 */
var resetClassName = function (resetArgument) {
  resetArgument.className = '';
};

/**
 * Функция заполняет поля элемента big-picture.
 * @param {event} eventAttribute - входящее событие
 */
var fillBigPicture = function (eventAttribute) {
  var currentObject = objectsList.filter(function (arrayObject) {
    return arrayObject.id === eventAttribute.target.children[0].id;
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
};

var uploadFileField = document.getElementById('upload-file');
var imageEditingOverlay = document.querySelector('.img-upload__overlay');
var closeButton = imageEditingOverlay.querySelector('.img-upload__cancel');
var ESC_CODE = 'Escape';
var ENTER_CODE = 'Enter';

var sliderPin = document.querySelector('.effect-level__pin');
var sliderLine = document.querySelector('.effect-level__line');
var sliderEffectInput = document.querySelector('.effect-level__value');

var imgPreviewWrapper = document.querySelector('.img-upload__preview');
var uploadImage = imgPreviewWrapper.querySelector('img');
var effectsList = document.querySelector('.effects__list');

uploadFileField.addEventListener('change', function () {
  openEditingOverlay(imageEditingOverlay);
});

closeButton.addEventListener('click', function () {
  closeEditingOverlay(imageEditingOverlay);
  clearInputValue(uploadFileField);
});

sliderPin.addEventListener('mouseup', function (evt) {
  var pinPoint = getPinPoint(getLeftCoords(sliderLine), evt);
  sliderEffectInput.setAttribute('value', pinPoint);
  addFilterNone(uploadImage);
  addFilterChrome(pinPoint, uploadImage);
  addFilterSepia(pinPoint, uploadImage);
  addFilterMarvin(pinPoint, uploadImage);
  addFilterPhobos(pinPoint, uploadImage);
  addFilterHeat(pinPoint, uploadImage);
});

effectsList.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('effects__radio')) {
    resetClassName(uploadImage);
    var newClass = sliceIdName(evt);
    addСlassThisElement(uploadImage, newClass);
    var effectLevelContainer = document.querySelector('.effect-level');
    hideEffectsNoneSlider(uploadImage, effectLevelContainer);
    var sliderEffectInputDefault = '100';
    sliderEffectInput.setAttribute('value', sliderEffectInputDefault);
    removeNecessaryAttribute(uploadImage, 'style');
  }
});

picturesList.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('picture__img')) {
    var currentObject = objectsList.filter(function (arrayObject) {
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
