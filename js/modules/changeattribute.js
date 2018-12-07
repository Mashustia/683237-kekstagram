'use strict';
(function () {
  /**
   * Функция для удаления атрибута тега
   * @param {object} checkedArgument тег, у которого будет удаляться атрибут
   * @param {string} removedAttribute атрибут, который нужно удалить
   */
  var removeAttribute = function (checkedArgument, removedAttribute) {
    checkedArgument.removeAttribute(removedAttribute);
  };

  var setAttribute = function (checkedArgument, name, value) {
    checkedArgument.setAttribute(name, value);
  };

  window.changeAttribute = {
    remove: removeAttribute,
    set: setAttribute
  };
})();
