'use strict';

(function () {
  /**
   * Функция для генерации случайного числа в промежутке min, max.
   * @function
   * @param {number} min минимальное значение числа.
   * @param {number} max максимальное значение числа.
   * @return {number} случайное число.
   */
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  window.getRandomNumber = getRandomNumber;
})();
