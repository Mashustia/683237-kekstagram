'use strict';
(function () {
  var ANY_NUMBER_OF_SPACES = /\s+/;
  var HASHTAG_SYMBOL = '#';
  var MIN_HASHTAG_LENGTH = 2;
  var MAX_HASHTAG_LENGTH = 20;
  var SECOND_SYMBOL = 1;
  var MAX_HASHTAG_COUNT = 4;

  var WarningLists = {
    FIRST_SYMBOL: 'Хэш-тег должен начинаться с символа #',
    MIN_LENGTH: 'Хеш-тег не может состоять только из одной решётки',
    MAX_LENGTH: 'Максимальная длина одного хэш-тега 20 символов, включая решётку',
    QUANTITY_EXCEEDED: 'Нельзя указать больше пяти хэш-тегов',
    DONT_REPEAT: 'Хештеги не должны повторяться',
    SPLIT_SPACE: 'Хэш-теги разделяются пробелами'
  };

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
   * @param {array} hashtags проверяемый массив хэштегов
   * @param {object} input - evt.target
   */
  var checkHashtag = function (hashtags, input) {
    hashtags.forEach(function (hashtag, index) {
      if (hashtag.charAt(0) !== HASHTAG_SYMBOL) {
        input.setCustomValidity(WarningLists.FIRST_SYMBOL);

      } else if (hashtag.length < MIN_HASHTAG_LENGTH) {
        input.setCustomValidity(WarningLists.MIN_LENGTH);

      } else if (hashtag.length > MAX_HASHTAG_LENGTH) {

        if (hashtag.includes(HASHTAG_SYMBOL, SECOND_SYMBOL)) {
          input.setCustomValidity(WarningLists.SPLIT_SPACE);

        } else {
          input.setCustomValidity(WarningLists.MAX_LENGTH);
        }

      } else if (index > MAX_HASHTAG_COUNT) {
        input.setCustomValidity(WarningLists.QUANTITY_EXCEEDED);
      }
    });
  };

  /**
   * Функция проверят, что в массиве нет повторяющихся значений
   * @function
   * @param {array} hashtags проверяемый массив хэштегов
   * @param {object} input - evt.target
   * @return {boolean} false в случае ошибки в тегах, true, когда теги верны
   */
  var checkHashtagRepeat = function (hashtags, input) {
    var uniuniqueHashtagArray = chooseUniqueElements(hashtags);

    if (uniuniqueHashtagArray.length !== hashtags.length) {
      input.setCustomValidity(WarningLists.DONT_REPEAT);
      return false;
    }

    return true;
  };

  /**
   * Функция создает из входящего масссива другой массив, содержащий только уникальные элементы
   * @function
   * @param {array} hashtags массив для проверки на уникальность
   * @return {string[]} возвращает массив уникальных значений
   */
  var chooseUniqueElements = function (hashtags) {
    var obj = {};
    hashtags.forEach(function (hashtag) {
      var str = hashtag.toLowerCase();
      obj[str] = true;
    });
    return Object.keys(obj);
  };

  /**
   * Слушатель события на input
   * @function
   * @param {event} evt
   */
  var hashtagInputCheckHandler = function (evt) {
    var hashtagArray = splitHashtagString(hashtagInput);
    var hashtagTarget = evt.target;

    if (hashtagArray !== '') {
      hashtagTarget.setCustomValidity('');
      checkHashtagRepeat(hashtagArray, hashtagTarget);
      checkHashtag(hashtagArray, hashtagTarget);
    }
  };

  var hashtagInput = document.querySelector('.text__hashtags');

  window.hashtagValidation = {
    check: hashtagInputCheckHandler
  };
})();
