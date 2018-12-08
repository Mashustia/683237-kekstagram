'use strict';
(function () {
  /**
   * Функция добавляет класс hidden тегу.
   * @function
   * @param {object} overlaySelector объект, которому нужно добавить класс hidden.
   */
  var closeEditingOverlay = function (overlaySelector) {
    overlaySelector.classList.add('hidden');
  };
  /**
   * Функция убирает класс hidden тега.
   * @function
   * @param {object} overlaySelector объект, у которого нужно убрать класс hidden.
   */
  var openEditingOverlay = function (overlaySelector) {
    overlaySelector.classList.remove('hidden');
  };
  /**
   * Функция удаляет событие.
   * @function
   * @param {func} clickHandlerName - удаляемое coбытие.
   */
  var removeClickHandler = function (clickHandlerName) {
    document.removeEventListener('keydown', clickHandlerName);
  };
  /**
   * Функция добавляет событие.
   * @function
   * @param {func} clickHandlerName - добавляемое событие.
   */
  var addClickHandler = function (clickHandlerName) {
    document.addEventListener('keydown', clickHandlerName);
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
    if (window.buttonCheck.escape(evt)) {
      closeEditingOverlay(imageEditingOverlay);
      removeClickHandler(window.editingOverlay.escClickHandler);
      clearInputValue(uploadFileField);
    }
  };
  var imageEditingOverlay = document.querySelector('.img-upload__overlay');
  var closeButton = imageEditingOverlay.querySelector('.img-upload__cancel');
  var uploadFileField = document.getElementById('upload-file');
  uploadFileField.addEventListener('change', function () {
    openEditingOverlay(imageEditingOverlay);
    addClickHandler(window.editingOverlay.escClickHandler);
  });
  closeButton.addEventListener('click', function () {
    closeEditingOverlay(imageEditingOverlay);
    removeClickHandler(window.editingOverlay.escClickHandler);
    clearInputValue(uploadFileField);
  });
  window.editingOverlay = {
    escClickHandler: escClickHandler
  };
})();
