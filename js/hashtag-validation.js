'use strict';
(function () {
  /**
   * Функция разделяет строку на массив, разделитель - пробел
   * @function
   * @param {string} checkString входящая строка
   * @return {never|string[]} массив
   */
  var splitHashtagString = function (checkString) {
    var ANY_NUMBER_OF_SPACES = /\s+/;
    if (checkString.value !== undefined) {
      var hashtagArray = checkString.value.split(ANY_NUMBER_OF_SPACES);
      var lastElement = hashtagArray[hashtagArray.length - 1];
      if (lastElement === '') {
        hashtagArray.pop();
      }
    }
    return hashtagArray;
  };

  /**
   * Функция проверят, что длинна массива хештегов не больше 5
   * @function
   * @param {array} checkArray проверяемый массив
   * @param {object} eventAttribute - evt.target
   * @return {boolean} false в случае ошибки в тегах, true, когда теги верны
   */
  var checkHashtagCount = function (checkArray, eventAttribute) {
    if (checkArray.length > 5) {
      eventAttribute.setCustomValidity(warningList.fourth);
      return false;
    }
    return true;
  };

  /**
   * Функция проверят, что:
   * 1) Хештег начинается с решетки
   * 2) Хештег не короче двух символов
   * 3) Хештег не длиннее двадцати символов
   * 4) Хэш-теги разделяются пробелами
   * @function
   * @param {array} checkArray проверяемый массив
   * @param {object} eventAttribute - evt.target
   */
  var checkHashtagLength = function (checkArray, eventAttribute) {
    var HASHTAG_SYMBOL = '#';
    var MIN_HASHTAG_LENGTH = 2;
    var MAX_HASHTAG_LENGTH = 20;
    var SPLIT_SYMBOL = /#/;
    var HASHTAG_SYMBOL_COUNT = 1;
    checkArray.forEach(function (hashtag) {
      if (hashtag.charAt(0) !== HASHTAG_SYMBOL) {
        eventAttribute.setCustomValidity(warningList.first);
        return false;
      }
      if (hashtag.length < MIN_HASHTAG_LENGTH) {
        eventAttribute.setCustomValidity(warningList.second);
        return false;
      }
      if (hashtag.length > MAX_HASHTAG_LENGTH) {
        eventAttribute.setCustomValidity(warningList.third);
        return false;
      }
      if ((hashtag.split(SPLIT_SYMBOL).length - 1) > HASHTAG_SYMBOL_COUNT) {
        eventAttribute.setCustomValidity(warningList.sixth);
        return false;
      }
      return true;
    });
  };

  /**
   * Функция проверят, что в массиве нет повторяющихся значений
   * @function
   * @param {array} checkArray проверяемый массив
   * @param {object} eventAttribute - evt.target
   * @return {boolean} false в случае ошибки в тегах, true, когда теги верны
   */
  var checkHashtagRepeat = function (checkArray, eventAttribute) {
    var uniuniqueHashtagArray = chooseUniqueElements(checkArray);
    if (uniuniqueHashtagArray.length !== checkArray.length) {
      eventAttribute.setCustomValidity(warningList.fifth);
      return false;
    }
    return true;
  };

  /**
   * Функция создает из входящего масссива другой массив, содержащий только уникальные элементы
   * @function
   * @param {array} checkedAray массив для проверки на уникальность
   * @return {string[]} возвращает массив уникальных значений
   */
  var chooseUniqueElements = function (checkedAray) {
    var obj = {};
    checkedAray.forEach(function (hashtag) {
      var str = hashtag.toLowerCase();
      obj[str] = true;
    });
    return Object.keys(obj);
  };

  var warningList = {
    first: 'Хэш-тег должен начинаться с символа #',
    second: 'Хеш-тег не может состоять только из одной решётки',
    third: 'Максимальная длина одного хэш-тега 20 символов, включая решётку',
    fourth: 'Нельзя указать больше пяти хэш-тегов',
    fifth: 'Хештеги не должны повторяться',
    sixth: 'Хэш-теги разделяются пробелами'
  };

  var hashtagInput = document.querySelector('.text__hashtags');

  hashtagInput.addEventListener('input', function (evt) {
    var hashtagArray = splitHashtagString(hashtagInput);
    var hashtagTarget = evt.target;
    if (hashtagArray !== '') {
      hashtagTarget.setCustomValidity('');
      checkHashtagRepeat(hashtagArray, hashtagTarget);
      checkHashtagLength(hashtagArray, hashtagTarget);
      checkHashtagCount(hashtagArray, hashtagTarget);
    }
  });

  hashtagInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', window.editingOverlay.escClickHandler);
  });

  hashtagInput.addEventListener('blur', function () {
    document.addEventListener('keydown', window.editingOverlay.escClickHandler);
  });
})();
