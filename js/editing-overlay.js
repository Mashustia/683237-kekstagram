'use strict';
(function () {
  /**
   * Функция для закрытия формы редактирования изображения по клавише esc
   * @function
   * @param {event} evt - event
   */
  var escClickHandler = function (evt) {
    if (window.buttonCheck.escape(evt)) {
      imageEditingOverlay.classList.add('hidden');
      document.removeEventListener('keydown', window.editingOverlay.escClickHandler);
      uploadFileField.value = '';
    }
  };

  var imageEditingOverlay = document.querySelector('.img-upload__overlay');
  var closeButton = imageEditingOverlay.querySelector('.img-upload__cancel');
  var uploadFileField = document.getElementById('upload-file');

  uploadFileField.addEventListener('change', function () {

    imageEditingOverlay.classList.remove('hidden');
    document.addEventListener('keydown', window.editingOverlay.escClickHandler);
  });

  closeButton.addEventListener('click', function () {
    imageEditingOverlay.classList.add('hidden');
    document.removeEventListener('keydown', window.editingOverlay.escClickHandler);
    uploadFileField.value = '';
  });

  window.editingOverlay = {
    escClickHandler: escClickHandler
  };
})();
