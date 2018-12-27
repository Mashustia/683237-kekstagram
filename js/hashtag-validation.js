'use strict';
(function () {
  var ANY_NUMBER_OF_SPACES = /\s+/;
  var HASHTAG_SYMBOL = '#';
  var MIN_HASHTAG_LENGTH = 2;
  var MAX_HASHTAG_LENGTH = 20;

  /**
   * Функция разделяет строку на массив, разделитель - пробел
   * @function
   * @param {string} checkString входящая строка
   * @return {never|string[]} массив
   */
  var splitHashtagString = function (checkString) {
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
   * Функция проверят, что:
   * 1) Хештег начинается с решетки
   * 2) Хештег не короче двух символов
   * 3) Хештег не длиннее двадцати символов
   * 4) Хештегов не может быть больше пяти
   * 5) Хэштеги разделяются пробелами
   * @function
   * @param {array} checkArray проверяемый массив
   * @param {object} eventAttribute - evt.target
   */
  var checkHashtagLength = function (checkArray, eventAttribute) {
    checkArray.forEach(function (hashtag, index) {
      if (hashtag.charAt(0) !== HASHTAG_SYMBOL) {
        eventAttribute.setCustomValidity(WarningLists.FIRST);
      } else if (hashtag.length < MIN_HASHTAG_LENGTH) {
        eventAttribute.setCustomValidity(WarningLists.SECOND);
      } else if (hashtag.length > MAX_HASHTAG_LENGTH) {
        if (hashtag.includes(HASHTAG_SYMBOL, 1)) {
          eventAttribute.setCustomValidity(WarningLists.SIXTH);
        } else {
          eventAttribute.setCustomValidity(WarningLists.THIRD);
        }
      } else if (index > 4) {
        eventAttribute.setCustomValidity(WarningLists.FOURTH);
      }
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
      eventAttribute.setCustomValidity(WarningLists.FIFTH);
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

  var hashtagInputCheckHandler = function (evt) {
    var hashtagArray = splitHashtagString(hashtagInput);
    var hashtagTarget = evt.target;
    if (hashtagArray !== '') {
      hashtagTarget.setCustomValidity('');
      checkHashtagRepeat(hashtagArray, hashtagTarget);
      checkHashtagLength(hashtagArray, hashtagTarget);
    }
  };

  var WarningLists = {
    FIRST: 'Хэш-тег должен начинаться с символа #',
    SECOND: 'Хеш-тег не может состоять только из одной решётки',
    THIRD: 'Максимальная длина одного хэш-тега 20 символов, включая решётку',
    FOURTH: 'Нельзя указать больше пяти хэш-тегов',
    FIFTH: 'Хештеги не должны повторяться',
    SIXTH: 'Хэш-теги разделяются пробелами'
  };

  var hashtagInput = document.querySelector('.text__hashtags');

  window.hashtagValidation = {
    check: hashtagInputCheckHandler
  };
})();
