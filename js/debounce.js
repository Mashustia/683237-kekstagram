'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  /**
   * Функция задает интервал срабатывания для события
   * @function
   * @param {func} cb функция, дя которой задается интервал срабатывания
   * @return {func} Timeout для входящей функции
   */
  window.debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
