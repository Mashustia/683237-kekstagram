'use strict';
(function () {
  var keyMap = {
    'esc': 'Escape',
    'enter': 'Enter',
    'arrowLeft': 'ArrowLeft',
    'arrowRight': 'ArrowRight'
  };

  var escape = function (evt) {
    return evt.code === keyMap['esc'];
  };

  var enter = function (evt) {
    return evt.code === keyMap['enter'];
  };

  var left = function (evt) {
    return evt.code === keyMap['arrowLeft'];
  };

  var right = function (evt) {
    return evt.code === keyMap['arrowRight'];
  };

  window.buttonCheck = {
    escape: escape,
    enter: enter,
    left: left,
    right: right
  };
})();
