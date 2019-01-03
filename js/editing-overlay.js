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

  var clearAttributes = function () {
    pictureScale.setAttribute('value', IMG_MAX_SIZE + PERCENT_SYMBOL);

    uploadImage.removeAttribute('class');
    uploadImage.removeAttribute('style');
    uploadImage.src = '';

    sliderPin.style.left = PROPORTION_MAX_VALUE + '%';

    sliderEffectLevelDepth.style.width = PROPORTION_MAX_VALUE + '%';

    sliderEffect.setAttribute('value', PROPORTION_MAX_VALUE + '%');

    //uploadFileField.value = '';
    //uploadFileField.focus();
  };

  /**
   * Функция сбрасывает данные формы и удаляет слушаетли событий
   * @function
   */
  var resetForm = function () {
    imageUploadOverlay.classList.add('hidden');
    sliderContainer.classList.add('hidden');

    removeHandlers();
    form.reset();
    clearAttributes();
  };

  /**
   * Функция для закрытия окна img-upload__overlay по кнопке img-upload__cancel
   * @function
   */
  var overlayCloseButtonClickHandler = function () {
    resetForm();
  };

  var successPopupRemoveClickHandlers = function () {
    document.removeEventListener('keydown', successPopupCloseKey);
    main.querySelector('.success__button').removeEventListener('click', successPopupButtonClickHandler);
    main.querySelector('.success').removeEventListener('click', successPopupOverlayClickHandler);
    main.querySelector('.success').remove();
    uploadFileField.focus();
  };

  /**
   * Функция для закрытия информационного окна об успешной отправке формы по клавише esc
   * @function
   * @param {event} successPopupEvtKey - event
   */
  var successPopupCloseKey = function (successPopupEvtKey) {
    if (window.buttonCheck.escape(successPopupEvtKey)) {
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
   * @param {event} successPopupClickEvt - event
   */
  var successPopupOverlayClickHandler = function (successPopupClickEvt) {
    if (successPopupClickEvt.target.classList.contains('success')) {
      successPopupRemoveClickHandlers();
    }
  };

  /**
   * Функция создает попап успешной отправки данных
   * @function
   */
  var popupSucces = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');

    main.appendChild(fragment.appendChild(successTemplate.cloneNode(true)));

    var successPopup = main.querySelector('.success');
    var successCloseButton = successPopup.querySelector('.success__button');

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

  var errorPopupRemoveClickHandlers = function () {
    document.removeEventListener('keydown', errorPopupCloseKey);
    document.addEventListener('keydown', escClickHandler);
    form.addEventListener('focusout', blurHandler);
    main.querySelector('.error').removeEventListener('click', errorPopupOverlayClickHandler);
    main.querySelector('.error').remove();
    minus.focus();
  };

  /**
   * Функция закрытия попапа Error по клавише esc
   * @function
   * @param {event} errorKey
   */
  var errorPopupCloseKey = function (errorKey) {
    if (window.buttonCheck.escape(errorKey)) {
      errorPopupRemoveClickHandlers();
    }
  };

  /**
   * Функция закрытия попапа Error по кнопке error__button
   * @function
   */
  var errorPopupButtonClickHandler = function () {
    errorPopupRemoveClickHandlers();
    minus.focus();
  };

  /**
   * Функция для закрытия закрытия попапа Error кликом по оверлею
   * @function
   * @param {event} errorPopupClickEvt - event
   */
  var errorPopupOverlayClickHandler = function (errorPopupClickEvt) {
    if (errorPopupClickEvt.target.classList.contains('error')) {
      errorPopupRemoveClickHandlers();
    }
  };

  var newFileButtonClickHandler = function () {
    resetForm();
  };

  var createErrorPopup = function (errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    main.appendChild(fragment.appendChild(errorTemplate.cloneNode(true)));

    var errorPopup = main.querySelector('.error');
    var title = errorPopup.querySelector('.error__title');

    title.textContent = errorMessage;
  };

  /**
   *  Функция показывет попап ошибки отправки формы
   *  @function
   */
  var onError = function () {
    createErrorPopup(ErrorsList.loadingError);

    document.removeEventListener('keydown', escClickHandler);
    form.removeEventListener('focusout', blurHandler);

    var errorPopup = main.querySelector('.error');
    var errorCloseButtons = errorPopup.querySelectorAll('.error__button');
    var newFileButton = errorPopup.querySelector('.error__button--new-file');
    var tryAgain = errorPopup.querySelector('.error__button--try-again');

    document.addEventListener('keydown', errorPopupCloseKey);
    errorCloseButtons.forEach(function (button) {
      button.addEventListener('click', errorPopupButtonClickHandler, {once: true});
    });
    errorPopup.addEventListener('click', errorPopupOverlayClickHandler);
    newFileButton.addEventListener('click', newFileButtonClickHandler, {once: true});
    tryAgain.focus();
  };

  /**
   * Функция переводит масштаб картинки из процентов в единицы
   * @function
   * @param {number} valueInPercent масштаб картинки в процентах
   * @return {number}
   */
  var calculateScale = function (valueInPercent) {
    return valueInPercent.slice(0, -1) / PROPORTION_MAX_VALUE;
  };

  /**
   * Слушатель событий для кнопки увеличения изображения
   * @function
   */
  var plusClickHandler = function () {
    var defaultValue = parseInt(pictureScale.value.slice(0, -1), 10);
    if (defaultValue < IMG_MAX_SIZE) {
      var newValue = defaultValue + IMAGE_SCALE_CHANGE + PERCENT_SYMBOL;
      pictureScale.setAttribute('value', newValue);
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
      var newValue = defaultValue - IMAGE_SCALE_CHANGE + PERCENT_SYMBOL;
      pictureScale.setAttribute('value', newValue);
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

  var removeErrorPopup = function () {
    var errorPopup = main.querySelector('.error');
    errorPopup.removeEventListener('click', errorPopupClickHandler);
    document.removeEventListener('keydown', errorPopupEscKeydownHandler);
    errorPopup.remove();
    form.reset();
    uploadFileField.focus();
  };

  var errorPopupClickHandler = function (evt) {
    if (evt.target.classList.contains('error') || evt.target.classList.contains('error__button--new-file')) {
      removeErrorPopup();
    }
  };

  var errorPopupEscKeydownHandler = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      removeErrorPopup();
    }
  };

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

      tryAgain.classList.add('hidden');

      errorPopup.addEventListener('click', errorPopupClickHandler);

      document.addEventListener('keydown', errorPopupEscKeydownHandler);
    }
  });

  window.editingOverlay = {
    esc: escClickHandler
  };
})();
