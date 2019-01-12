'use strict';
(function () {
  var IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
  var IMAGE_SCALE_CHANGE = 25;
  var PERCENT_SYMBOL = '%';
  var IMG_MAX_SIZE = 100;
  var IMG_MIN_SIZE = 25;
  var PROPORTION_MAX_VALUE = 100;

  var ErrorsList = {
    wrongFormat: 'Неверный формат файла',
    loadingError: 'Ошибка загрузки файла'
  };

  var ErrorPopupClassList = {
    overlay: 'error',
    tryAgain: 'error__button--try-again',
    newFile: 'error__button--new-file'
  };

  /**
   * Функция для закрытия формы редактирования изображения по клавише esc
   * @function
   * @param {event} evt - event
   */
  var escClickHandler = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      resetForm();
    }
  };

  /**
   * Функция очищает атрибуты формы
   * @function
   */
  var clearAttributes = function () {
    pictureScale.setAttribute('value', IMG_MAX_SIZE + PERCENT_SYMBOL);

    uploadImage.style.filter = null;
    uploadImage.style.transform = null;

    Array.from(effectsList.querySelectorAll('.effects__radio')).forEach(function (input) {
      if (input.checked) {
        uploadImage.classList.remove(window.slider.filter[input.value].class);
      }
    });

    uploadImage.removeAttribute('class');

    uploadImage.src = '';

    sliderPin.style.left = PROPORTION_MAX_VALUE + '%';

    sliderEffectLevelDepth.style.width = PROPORTION_MAX_VALUE + '%';

    sliderEffect.setAttribute('value', PROPORTION_MAX_VALUE + '%');
  };

  /**
   * Функция сбрасывает данные формы и удаляет слушатели событий
   * @function
   */
  var resetForm = function () {
    imageUploadOverlay.classList.add('hidden');
    sliderContainer.classList.add('hidden');

    removeHandlers();
    clearAttributes();
    form.reset();
  };

  /**
   * Функция для закрытия окна img-upload__overlay по кнопке img-upload__cancel
   * @function
   */
  var overlayCloseButtonClickHandler = function () {
    resetForm();
  };

  /**
   * Функция удаляет слушатели событий для popup success
   * @function
   */
  var successPopupRemoveClickHandlers = function () {
    var successPopup = main.querySelector('.success');

    document.removeEventListener('keydown', successPopupCloseKey);
    successPopup.querySelector('.success__button').removeEventListener('click', successPopupButtonClickHandler);
    successPopup.removeEventListener('click', successPopupOverlayClickHandler);
    successPopup.remove();
    uploadFileField.focus();
  };

  /**
   * Функция для закрытия информационного окна об успешной отправке формы по клавише esc
   * @function
   * @param {event} evt - event
   */
  var successPopupCloseKey = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      successPopupRemoveClickHandlers();
    }
  };

  /**
   * Функция для закрытия информационного окна об успешной отправке формы по кнопке .success__button
   * @function
   */
  var successPopupButtonClickHandler = function () {
    successPopupRemoveClickHandlers();
  };

  /**
   * Функция для закрытия информационного окна об успешной отправке формы оверлею
   * @function
   * @param {event} evt - event
   */
  var successPopupOverlayClickHandler = function (evt) {
    if (evt.target.classList.contains('success')) {
      successPopupRemoveClickHandlers();
    }
  };

  /**
   * Функция создает попап при успешной отправке данных
   * @function
   */
  var popupSucces = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successPopup = successTemplate.cloneNode(true);
    var successCloseButton = successPopup.querySelector('.success__button');

    main.appendChild(fragment.appendChild(successPopup));

    document.addEventListener('keydown', successPopupCloseKey);
    successCloseButton.addEventListener('click', successPopupButtonClickHandler, {once: true});
    successPopup.addEventListener('click', successPopupOverlayClickHandler);

    successCloseButton.focus();
  };

  /**
   * Функция выполняется если форма отправлена успешно.
   * @function
   */
  var onLoad = function () {
    resetForm();
    popupSucces();
  };

  /**
   * Функция закрытия попапа Error по клавише esc
   * @function
   * @param {event} evt
   */
  var errorPopupCloseKey = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      removeErrorPopup();
    }
  };

  /**
   * Функция создает попап с информация об ошибке
   * @function
   * @param {object} errorMessage - сообщение об ошибке, которое нужно вывести
   */
  var createErrorPopup = function (errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorPopup = errorTemplate.cloneNode(true);
    var title = errorPopup.querySelector('.error__title');

    main.appendChild(fragment.appendChild(errorPopup));

    title.textContent = errorMessage;
  };

  /**
   * Функция удаляет попап с информация об ошибке
   * @function
   */
  var removeErrorPopup = function () {
    var errorPopup = main.querySelector('.error');

    document.removeEventListener('keydown', errorPopupCloseKey);
    errorPopup.removeEventListener('click', errorPopupClickHandler);

    document.addEventListener('keydown', escClickHandler);
    form.addEventListener('focusout', blurHandler);

    errorPopup.remove();

    minus.focus();
  };

  /**
   * Слушатель события click на попапе error
   * @function
   * @param {event} evt событие
   */
  var errorPopupClickHandler = function (evt) {
    var classList = evt.target.classList;

    if (classList.contains(ErrorPopupClassList.newFile)) {
      removeErrorPopup();
      resetForm();

    } else if (classList.contains(ErrorPopupClassList.overlay) || classList.contains(ErrorPopupClassList.tryAgain)) {
      removeErrorPopup();
    }
  };

  /**
   *  Функция выполняется в случае ошибки отправки формы
   *  @function
   */
  var onError = function () {
    createErrorPopup(ErrorsList.loadingError);

    var errorPopup = main.querySelector('.error');
    var tryAgain = errorPopup.querySelector('.error__button--try-again');

    document.removeEventListener('keydown', escClickHandler);
    form.removeEventListener('focusout', blurHandler);

    errorPopup.addEventListener('click', errorPopupClickHandler);
    document.addEventListener('keydown', errorPopupCloseKey);

    tryAgain.focus();
  };

  /**
   * Функция переводит масштаб картинки из процентов в единицы
   * @function
   * @param {number} valueInPercent масштаб картинки в процентах
   * @return {number}
   */
  var calculateScale = function (valueInPercent) {
    return valueInPercent / PROPORTION_MAX_VALUE;
  };

  /**
   * Слушатель событий для кнопки увеличения изображения
   * @function
   */
  var plusClickHandler = function () {
    var defaultValue = parseInt(pictureScale.value.slice(0, -1), 10);

    if (defaultValue < IMG_MAX_SIZE) {
      var newValue = defaultValue + IMAGE_SCALE_CHANGE;

      pictureScale.setAttribute('value', newValue + PERCENT_SYMBOL);
      uploadImage.style.transform = 'scale(' + calculateScale(newValue) + ')';
    }
  };

  /**
   * Слушатель событий для кнопки уменьшения изображения
   * @function
   */
  var minusClickHandler = function () {
    var defaultValue = parseInt(pictureScale.value.slice(0, -1), 10);

    if (defaultValue > IMG_MIN_SIZE) {
      var newValue = defaultValue - IMAGE_SCALE_CHANGE;

      pictureScale.setAttribute('value', newValue + PERCENT_SYMBOL);
      uploadImage.style.transform = 'scale(' + calculateScale(newValue) + ')';
    }
  };

  /**
   * Слушатель события отправки формы
   * @function
   * @param {event} evt
   */
  var formSubmitHandler = function (evt) {
    window.server.upload(new FormData(form), onLoad, onError);
    evt.preventDefault();
  };

  /**
   * Слушатель события на оверлее img-upload__overlay
   * @function
   * @param {event} evt
   */
  var imageUploadOverlayClickHandler = function (evt) {
    if (evt.target.classList.contains('img-upload__overlay')) {
      resetForm();
    }
  };

  /**
   * Удаляет слушатель события закрытия окна по escape
   * @function
   * @param {event} evt
   */
  var focusHandler = function (evt) {
    if (evt.target.classList.contains('text__hashtags') || evt.target.classList.contains('text__description')) {
      document.removeEventListener('keydown', escClickHandler);
    }
  };

  /**
   * Добавляет слушатель события закрытия окна по escape
   * @function
   * @param {event} evt
   */
  var blurHandler = function (evt) {
    if (!evt.target.classList.contains('text__hashtags') || !evt.target.classList.contains('text__description')) {
      document.addEventListener('keydown', escClickHandler);
    }
  };

  /**
   * Функция удаляет все слушатели событий для формы
   * @function
   */
  var removeHandlers = function () {
    document.removeEventListener('keydown', escClickHandler);

    plus.removeEventListener('click', plusClickHandler);

    minus.removeEventListener('click', minusClickHandler);

    imageUploadOverlay.removeEventListener('mousedown', imageUploadOverlayClickHandler);

    form.removeEventListener('submit', formSubmitHandler);
    form.removeEventListener('focusin', focusHandler);
    form.removeEventListener('focusout', blurHandler);

    hashtagInput.removeEventListener('input', window.hashtagValidation.check);

    effectsList.removeEventListener('click', window.slider.filterClick);

    sliderPin.removeEventListener('mousedown', window.slider.pinClick);
    sliderPin.removeEventListener('keydown', window.slider.pinKeydown);

    sliderLine.removeEventListener('click', window.slider.lineClick);
  };

  /**
   * Функция добавляет слушатели событий для формы
   * @function
   */
  var addHandlers = function () {
    document.addEventListener('keydown', escClickHandler);

    closeButton.addEventListener('click', overlayCloseButtonClickHandler, {once: true});

    plus.addEventListener('click', plusClickHandler);

    minus.addEventListener('click', minusClickHandler);

    imageUploadOverlay.addEventListener('mousedown', imageUploadOverlayClickHandler);

    form.addEventListener('submit', formSubmitHandler);
    form.addEventListener('focusin', focusHandler);
    form.addEventListener('focusout', blurHandler);

    hashtagInput.addEventListener('input', window.hashtagValidation.check);

    effectsList.addEventListener('click', window.slider.filterClick);

    sliderPin.addEventListener('mousedown', window.slider.pinClick);
    sliderPin.addEventListener('keydown', window.slider.pinKeydown);

    sliderLine.addEventListener('click', window.slider.lineClick);
  };

  /**
   * Функция удаляет попап с информацией о неверном формате загружаемого файла
   * @function
   */
  var removeFormatErrorPopup = function () {
    var errorPopup = main.querySelector('.error');

    errorPopup.removeEventListener('click', errorFormatPopupClickHandler);
    document.removeEventListener('keydown', errorPopupEscKeydownHandler);

    errorPopup.remove();

    form.reset();

    uploadFileField.focus();
  };

  /**
   * Слушатель события click на попапе с информацией о неверном формате загружаемого файла
   * @function
   * @param {ebent} evt событие
   */
  var errorFormatPopupClickHandler = function (evt) {
    var classList = evt.target.classList;

    if (classList.contains(ErrorPopupClassList.overlay) || classList.contains(ErrorPopupClassList.newFile)) {
      removeFormatErrorPopup();
    }
  };

  /**
   * Слушатель события keydown на попапе с информацией о неверном формате загружаемого файла
   * @function
   * @param {ebent} evt событие
   */
  var errorPopupEscKeydownHandler = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      removeFormatErrorPopup();
    }
  };

  var form = document.querySelector('#upload-select-image');
  var fragment = document.createDocumentFragment();
  var imageUploadOverlay = form.querySelector('.img-upload__overlay');
  var closeButton = form.querySelector('.img-upload__cancel');
  var uploadFileField = form.querySelector('#upload-file');
  var main = document.querySelector('main');
  var imgPreviewWrapper = document.querySelector('.img-upload__preview');
  var uploadImage = imgPreviewWrapper.querySelector('img');
  var plus = imageUploadOverlay.querySelector('.scale__control--bigger');
  var minus = imageUploadOverlay.querySelector('.scale__control--smaller');
  var pictureScale = imageUploadOverlay.querySelector('.scale__control--value');
  var sliderContainer = document.querySelector('.effect-level');
  var sliderPin = sliderContainer.querySelector('.effect-level__pin');
  var sliderEffectLevelDepth = sliderContainer.querySelector('.effect-level__depth');
  var sliderEffect = sliderContainer.querySelector('.effect-level__value');
  var hashtagInput = document.querySelector('.text__hashtags');
  var effectsList = document.querySelector('.effects__list');
  var sliderLine = sliderContainer.querySelector('.effect-level__line');

  uploadFileField.addEventListener('change', function () {
    var file = uploadFileField.files[0];

    var matches = IMAGE_MIME_TYPES.some(function (type) {
      return type === file.type;
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        uploadImage.src = reader.result;
      });
      reader.readAsDataURL(file);

      imageUploadOverlay.classList.remove('hidden');
      minus.focus();
      addHandlers();

    } else {
      createErrorPopup(ErrorsList.wrongFormat);

      var errorPopup = main.querySelector('.error');
      var tryAgain = errorPopup.querySelector('.error__button--try-again');
      var newFile = errorPopup.querySelector('.error__button--new-file');

      tryAgain.classList.add('hidden');
      newFile.focus();

      errorPopup.addEventListener('click', errorFormatPopupClickHandler);
      document.addEventListener('keydown', errorPopupEscKeydownHandler);
    }
  });

  window.editingOverlay = {
    esc: escClickHandler
  };
})();
