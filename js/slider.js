'use strict';
(function () {
  /**
   * Функция рассчитывает интенсивность эффекта (Хром, Сепия, Фобос...) в зависимости от положения пина.
   * @function
   * @param {object} startingCoordinate координата пина на нуле.
   * @param {object} clickPoint задает event.
   * @return {number} возвращает интенсивность фильтра от 0 до 100.
   */
  var getPinPoint = function (startingCoordinate, clickPoint) {
    var CONTAINER_WIDTH = 453;
    var PROPORTION_MAX_VALUE = 100;
    var PROPORTION_MIN_VALUE = 0;
    var saturationValue = (clickPoint.clientX - startingCoordinate) * PROPORTION_MAX_VALUE / CONTAINER_WIDTH;
    if (saturationValue < PROPORTION_MIN_VALUE) {
      saturationValue = PROPORTION_MIN_VALUE;
    }
    if (saturationValue > PROPORTION_MAX_VALUE) {
      saturationValue = PROPORTION_MAX_VALUE;
    }
    return saturationValue;
  };

  /**
   * Функция для определения координат контейнера.
   * @function
   * @param {object} elem контейнер для которого нужны координаты.
   * @return {number} возвращает координату контейнера по X
   */
  var getLeftCoords = function (elem) {
    var box = elem.getBoundingClientRect();
    return box.left + pageXOffset;
  };

  /**
   * Функция переводит интенсивность фильтра в проценты согласно пропорции.
   * @function
   * @param {number} PinPointValue интенсивность фильтра от 0 до 100.
   * @param {number} filterMaxValue максимальное значение фильтра в единицах.
   * @return {number} возвращает интенсивность фильтра в прцентах от filterMaxValue.
   */
  var returnPercent = function (PinPointValue, filterMaxValue) {
    var PROPORTION_MAX_VALUE = 100;
    var percent = PinPointValue * (filterMaxValue / PROPORTION_MAX_VALUE);
    return percent;
  };

  /**
   * Функция добавляет css свойсто style выбранному тегу
   * @function
   * @param {object} checkedArgument - тег, которому нужно добавить стиль
   * @param {string} cssProperty - css-своство, которое будет добавлено
   * @param {number} cssPropertyValue - значение css - свойства, которое будет добавлено (численное)
   * @param {boolean} inPercent true, если cssPropertyValue должно быть в процентах
   * @param {boolean} inPixels true, если cssPropertyValue должно быть в пикселях
   */
  var addFilterName = function (checkedArgument, cssProperty, cssPropertyValue, inPercent, inPixels) {
    if (inPercent) {
      checkedArgument.style.filter = '' + cssProperty + '(' + cssPropertyValue + '%' + ')';
    } else if (inPixels) {
      checkedArgument.style.filter = '' + cssProperty + '(' + cssPropertyValue + 'px' + ')';
    } else {
      checkedArgument.style.filter = '' + cssProperty + '(' + cssPropertyValue + ')';
    }
  };

  /**
   * Функция добавляет тегу стили, в зависимости от класса
   * @function
   * @param {number} PinPointValue - интенсивность фильтра от 0 до 100.
   * @param {object} checkedTag - тег, у которого проверяется класс
   * @param {object} filterPropertiesList - объект с параметрами фильтров
   */
  var addAllFilters = function (PinPointValue, checkedTag, filterPropertiesList) {
    switch (checkedTag.className) {
      case filterPropertiesList.none.class:
        break;
      case filterPropertiesList.chrome.class:
        addFilterName(checkedTag, filterPropertiesList.chrome.cssProperty, returnPercent(PinPointValue, filterPropertiesList.chrome.maxValue));
        break;
      case filterPropertiesList.sepia.class:
        addFilterName(checkedTag, filterPropertiesList.sepia.cssProperty, returnPercent(PinPointValue, filterPropertiesList.sepia.maxValue));
        break;
      case filterPropertiesList.marvin.class:
        addFilterName(checkedTag, filterPropertiesList.marvin.cssProperty, PinPointValue, true);
        break;
      case filterPropertiesList.phobos.class:
        addFilterName(checkedTag, filterPropertiesList.phobos.cssProperty, returnPercent(PinPointValue, filterPropertiesList.phobos.maxValue), false, true);
        break;
      case filterPropertiesList.heat.class:
        addFilterName(checkedTag, filterPropertiesList.heat.cssProperty, returnPercent(PinPointValue, filterPropertiesList.heat.maxValue));
        break;
      default:
        break;
    }
  };

  /**
   * Функция обрезает id элемента так, как нужно.
   * @function
   * @param {event} checkedEvent проверяемый элемент.
   * @return {string} возвращает измененный id.
   */
  var sliceIdName = function (checkedEvent) {
    var EFFECT_NAME_FIRST_LETTER_NUMBER = 7;
    var EFFECTS_PREVIEW = 'effects__preview--';
    return EFFECTS_PREVIEW + checkedEvent.target.id.slice(EFFECT_NAME_FIRST_LETTER_NUMBER);
  };

  /**
   * Функция скрывает слайдер для effects__preview--none.
   * @function
   * @param {object} checkedArgument параметр, класс которого проверяем.
   * @param {object} mustBeHidden параметр, который должен быть скрыт.
   */
  var hideSlider = function (checkedArgument, mustBeHidden) {
    if (checkedArgument.classList.contains(filterProperties.none.class)) {
      mustBeHidden.classList.add('hidden');
    } else {
      mustBeHidden.classList.remove('hidden');
    }
  };

  /**
   * Функция округляет входящие значения
   * @param {number} numberToRound число, которое нужно округлить
   * @param {number} numberDigit разряд, до которого нужно округлить. До десятых -> 10, до сотых -> 100 и т.д.
   * @return {number}
   */
  var roundNumber = function (numberToRound, numberDigit) {
    return Math.round(numberToRound * numberDigit) / numberDigit;
  };

  /**
   * Функция устанавливает объекту положение слева
   * @function
   * @param {object} tagName - объект, которому нужно добавить стили
   * @param {number} styleValue - значение стиля
   */
  var setStyleLeft = function (tagName, styleValue) {
    var PERCENT_SIGN = '%';
    tagName.style.left = styleValue + PERCENT_SIGN;
  };

  /**
   * Функция устанавливает объекту ширину
   * @function
   * @param {object} tagName - объект, которому нужно добавить стили
   * @param {number} styleValue - значение стиля
   */
  var setStyleWidth = function (tagName, styleValue) {
    var PERCENT_SIGN = '%';
    tagName.style.width = styleValue + PERCENT_SIGN;
  };

  var filterProperties = {
    none: {
      name: 'none',
      cssProperty: 'none',
      class: 'effects__preview--none',
      maxValue: 1
    },
    chrome: {
      name: 'chrome',
      cssProperty: 'grayscale',
      class: 'effects__preview--chrome',
      maxValue: 1
    },
    sepia: {
      name: 'sepia',
      cssProperty: 'sepia',
      class: 'effects__preview--sepia',
      maxValue: 1
    },
    marvin: {
      name: 'marvin',
      cssProperty: 'invert',
      class: 'effects__preview--marvin',
      maxValue: 1
    },
    phobos: {
      name: 'phobos',
      cssProperty: 'blur',
      class: 'effects__preview--phobos',
      maxValue: 3
    },
    heat: {
      name: 'heat',
      cssProperty: 'brightness',
      class: 'effects__preview--heat',
      maxValue: 3
    }
  };

  var imgPreviewWrapper = document.querySelector('.img-upload__preview');
  var uploadImage = imgPreviewWrapper.querySelector('img');
  var effectsList = document.querySelector('.effects__list');
  var sliderEffect = document.querySelector('.effect-level__value');
  var sliderPin = document.querySelector('.effect-level__pin');
  var sliderLine = document.querySelector('.effect-level__line');

  effectsList.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('effects__radio')) {
      var newClass = sliceIdName(evt);
      var effectLevelContainer = document.querySelector('.effect-level');
      var sliderEffectInputDefault = '100';
      var sliderEffectLevelDepth = document.querySelector('.effect-level__depth');

      uploadImage.className = '';
      uploadImage.classList.add(newClass);
      hideSlider(uploadImage, effectLevelContainer);
      setStyleLeft(sliderPin, sliderEffectInputDefault);
      setStyleWidth(sliderEffectLevelDepth, sliderEffectInputDefault);
      sliderEffect.setAttribute('value', sliderEffectInputDefault);
      uploadImage.removeAttribute('style');
    }
  });

  sliderPin.addEventListener('mousedown', function (evt) {
    var ROUNDING_VALUE = 100;
    var startPinPoint = getPinPoint(getLeftCoords(sliderLine), evt);
    var sliderEffectLevelDepth = document.querySelector('.effect-level__depth');

    var onMouseMove = function (moveEvt) {
      var shift = getPinPoint(getLeftCoords(sliderLine), moveEvt) - startPinPoint;
      var roundNewPinPointValue = roundNumber((startPinPoint + shift), ROUNDING_VALUE);

      setStyleLeft(sliderPin, roundNewPinPointValue);
      setStyleWidth(sliderEffectLevelDepth, roundNewPinPointValue);
      sliderEffect.setAttribute('value', roundNewPinPointValue);
      addAllFilters(startPinPoint, uploadImage, filterProperties);

      startPinPoint = getPinPoint(getLeftCoords(sliderLine), moveEvt);
    };

    var onMouseUp = function () {
      var roundStartPinPointValue = roundNumber(startPinPoint, ROUNDING_VALUE);

      setStyleLeft(sliderPin, roundStartPinPointValue);
      setStyleWidth(sliderEffectLevelDepth, roundStartPinPointValue);
      sliderEffect.setAttribute('value', roundStartPinPointValue);
      addAllFilters(startPinPoint, uploadImage, filterProperties);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
