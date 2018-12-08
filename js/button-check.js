'use strict';
(function () {
  var ESC_CODE = 'Escape';
  var ENTER_CODE = 'Enter';

  var escapeButton = function (evt) {
    if (evt.code === ESC_CODE) {
      return true;
    }
    return false;
  };

  var enterButton = function (evt) {
    if (evt.code === ENTER_CODE) {
      return true;
    }
    return false;
  };

  window.buttonCheck = {
    escape: escapeButton,
    enter: enterButton
  };
})();
