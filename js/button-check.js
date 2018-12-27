'use strict';
(function () {
  var keyMap = {
    'esc': 'Escape',
    'enter': 'Enter',
    'arrowLeft': 'ArrowLeft',
    'arrowRight': 'ArrowRight'
  };

  var escape = function (evt) {
    if (evt.code === keyMap['esc']) {
      return true;
    }
    return false;
  };

  var enter = function (evt) {
    if (evt.code === keyMap['enter']) {
      return true;
    }
    return false;
  };

  var left = function (evt) {
    if (evt.code === keyMap['arrowLeft']) {
      return true;
    }
    return false;
  };

  var right = function (evt) {
    if (evt.code === keyMap['arrowRight']) {
      return true;
    }
    return false;
  };

  window.buttonCheck = {
    escape: escape,
    enter: enter,
    left: left,
    right: right
  };
})();
