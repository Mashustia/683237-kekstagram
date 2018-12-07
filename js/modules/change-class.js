'use strict';
(function () {
  /**
   * Универсальная функция для добавления класса.
   * @function
   * @param {object} placeToAdd - аргумент, которому нужно добавить класс.
   * @param {object} Class класс, который нужно добавить.
   */
  var addСlassThisElement = function (placeToAdd, Class) {
    placeToAdd.classList.add(Class);
  };

  /**
   * Универсальная функция для удаления класса.
   * @function
   * @param {object} placeToAdd - аргумент, которому нужно удалить класс.
   * @param {object} Class класс, который нужно удалить.
   */
  var removeСlassThisElement = function (placeToAdd, Class) {
    placeToAdd.classList.remove(Class);
  };

  window.changeClass = {
    add: addСlassThisElement,
    remove: removeСlassThisElement
  };
})();
