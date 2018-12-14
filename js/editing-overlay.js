'use strict';
(function () {
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
   * Функция сбрасывает данные формы
   * @function
   */
  var resetForm = function () {
    imageUploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', escClickHandler);
    uploadFileField.value = '';
    form.reset();
    uploadImage.removeAttribute('class');
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
    main.querySelector('.error').removeEventListener('click', errorPopupOverlayClickHandler);
    main.querySelector('.error').remove();
  };

  /**
   * Функция закрытия попапа Error по клавише esc
   * @function
   * @param {evt} errorKey
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

  /**
   *  Функция показывет попап ошибки отправки формы
   *  @function
   */
  var onError = function () {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');

    main.appendChild(fragment.appendChild(errorTemplate.cloneNode(true)));

    document.removeEventListener('keydown', escClickHandler);

    var errorPopup = main.querySelector('.error');
    var errorCloseButtons = errorPopup.querySelectorAll('.error__button');
    var newFileButton = errorPopup.querySelector('.error__button--new-file');

    document.addEventListener('keydown', errorPopupCloseKey);
    errorCloseButtons.forEach(function (button) {
      button.addEventListener('click', errorPopupButtonClickHandler, {once: true});
    });
    errorPopup.addEventListener('click', errorPopupOverlayClickHandler);
    newFileButton.addEventListener('click', newFileButtonClickHandler, {once: true});
  };

  var form = document.querySelector('#upload-select-image');
  var fragment = document.createDocumentFragment();
  var imageUploadOverlay = form.querySelector('.img-upload__overlay');
  var closeButton = form.querySelector('.img-upload__cancel');
  var uploadFileField = form.querySelector('#upload-file');
  var main = document.querySelector('main');
  var imgPreviewWrapper = document.querySelector('.img-upload__preview');
  var uploadImage = imgPreviewWrapper.querySelector('img');

  uploadFileField.addEventListener('change', function () {
    imageUploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', escClickHandler);
    closeButton.addEventListener('click', overlayCloseButtonClickHandler, {once: true});
  });

  imageUploadOverlay.addEventListener('click', function (uploadOverlayClickEvt) {
    if (uploadOverlayClickEvt.target.classList.contains('img-upload__overlay')) {
      resetForm();
    }
  });

  form.addEventListener('submit', function (evt) {
    window.server.upload(new FormData(form), onLoad, onError);
    evt.preventDefault();
  });

  window.editingOverlay = {
    esc: escClickHandler
  };
})();
