'use strict';
(function () {
  var CONTAINER_WIDTH = 453;
  var PROPORTION_MAX_VALUE = 100;
  var PROPORTION_MIN_VALUE = 0;
  var ROUNDING_VALUE = 100;

  /**
   * Функция рассчитывает интенсивность эффекта (Хром, Сепия, Фобос...) в зависимости от положения пина.
   * @function
   * @param {object} startingCoordinate координата пина на нуле.
   * @param {object} clickPoint задает event.
   * @return {number} возвращает интенсивность фильтра от 0 до 100.
   */
  var getPinPoint = function (startingCoordinate, clickPoint) {
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
    var percent = PinPointValue * (filterMaxValue / PROPORTION_MAX_VALUE);
    return percent;
  };

  /**
   * Функция добавляет объекту checkedTag стили
   * @param {number} PinPointValue значение ползунка слайдера
   * @param {objeckt} checkedTag тег, которому добавляются стили
   * @param {objeckt} filterPropertiesList список объектов
   */
  var addFilters = function (PinPointValue, checkedTag, filterPropertiesList) {
    var filter = filterPropertiesList[checkedTag.className];
    checkedTag.style.filter = filter.cssProperty + '(' + returnPercent(PinPointValue, filter.maxValue) + filter.units + ')';
  };

  /**
   * Функция скрывает слайдер для effects__preview--none.
   * @function
   * @param {object} checkedArgument параметр, класс которого проверяем.
   * @param {object} mustBeHidden параметр, который должен быть скрыт.
   */
  var hideSlider = function (checkedArgument, mustBeHidden) {
    if (checkedArgument.classList.contains(filterMap['none'])) {
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
    tagName.style.left = styleValue + '%';
  };

  /**
   * Функция устанавливает объекту ширину
   * @function
   * @param {object} tagName - объект, которому нужно добавить стили
   * @param {number} styleValue - значение стиля
   */
  var setStyleWidth = function (tagName, styleValue) {
    tagName.style.width = styleValue + '%';
  };

  /**
   * Функция задает положение пина слайдера, добавляет фильтры картинке, задает инпуту effect-level__value значение интенсивности фильтра
   * @function
   * @param {number} pointPosition значение интенсивности фильтра
   */
  var setSliderPriperties = function (pointPosition) {
    setStyleLeft(sliderPin, pointPosition);
    setStyleWidth(sliderEffectLevelDepth, pointPosition);
    addFilters(pointPosition, uploadImage, filterProperties);
    sliderEffect.setAttribute('value', pointPosition);
  };

  var filterProperties = {
    'effects__preview--none': {
      cssProperty: 'none',
      units: '',
      maxValue: 1
    },
    'effects__preview--chrome': {
      cssProperty: 'grayscale',
      units: '',
      maxValue: 1
    },
    'effects__preview--sepia': {
      cssProperty: 'sepia',
      units: '',
      maxValue: 1
    },
    'effects__preview--marvin': {
      cssProperty: 'invert',
      units: '%',
      maxValue: 100
    },
    'effects__preview--phobos': {
      cssProperty: 'blur',
      units: 'px',
      maxValue: 3
    },
    'effects__preview--heat': {
      cssProperty: 'brightness',
      units: '',
      maxValue: 3
    }
  };

  var filterMap = {
    'none': 'effects__preview--none',
    'chrome': 'effects__preview--chrome',
    'sepia': 'effects__preview--sepia',
    'marvin': 'effects__preview--marvin',
    'phobos': 'effects__preview--phobos',
    'heat': 'effects__preview--heat'
  };

  var imgPreviewWrapper = document.querySelector('.img-upload__preview');
  var uploadImage = imgPreviewWrapper.querySelector('img');
  var effectsList = document.querySelector('.effects__list');
  var sliderEffect = document.querySelector('.effect-level__value');
  var sliderPin = document.querySelector('.effect-level__pin');
  var sliderLine = document.querySelector('.effect-level__line');
  var sliderEffectLevelDepth = document.querySelector('.effect-level__depth');

  effectsList.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('effects__radio')) {
      var effectLevelContainer = document.querySelector('.effect-level');
      var sliderEffectInputDefault = '100';

      Array.from(effectsList.querySelectorAll('.effects__radio')).forEach(function (input) {
        if (input.checked) {
          uploadImage.removeAttribute('class');
          uploadImage.classList.add(filterMap[input.value]);
          uploadImage.style.filter = null;
        }
      });

      hideSlider(uploadImage, effectLevelContainer);
      setStyleLeft(sliderPin, sliderEffectInputDefault);
      setStyleWidth(sliderEffectLevelDepth, sliderEffectInputDefault);
      sliderEffect.setAttribute('value', sliderEffectInputDefault);
    }
  });

  sliderPin.addEventListener('mousedown', function (evt) {
    var startPinPoint = getPinPoint(getLeftCoords(sliderLine), evt);

    var onMouseMove = function (moveEvt) {
      var shift = getPinPoint(getLeftCoords(sliderLine), moveEvt) - startPinPoint;
      var roundNewPinPointValue = roundNumber((startPinPoint + shift), ROUNDING_VALUE);

      setSliderPriperties(roundNewPinPointValue);

      startPinPoint = getPinPoint(getLeftCoords(sliderLine), moveEvt);
    };

    var onMouseUp = function () {
      var roundStartPinPointValue = roundNumber(startPinPoint, ROUNDING_VALUE);

      setSliderPriperties(roundStartPinPointValue);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  sliderPin.addEventListener('keydown', function (evt) {
    var start = parseInt((sliderPin.style.left).slice(0, -1), 10);
    var step = 10;

    if (window.buttonCheck.left(evt)) {
      var nextPointLeft = start - step;

      if (start <= step) {
        nextPointLeft = PROPORTION_MIN_VALUE;
      }

      setSliderPriperties(nextPointLeft);
    }

    if (window.buttonCheck.right(evt)) {
      var nextPointRight = start + step;

      if (start >= (PROPORTION_MAX_VALUE - step)) {
        nextPointRight = PROPORTION_MAX_VALUE;
      }

      setSliderPriperties(nextPointRight);
    }
  });

  sliderLine.addEventListener('click', function (evt) {
    if (evt.target !== sliderPin) {
      var clickPoint = getPinPoint(getLeftCoords(sliderLine), evt);
      var roundNewClickPointtValue = roundNumber((clickPoint), ROUNDING_VALUE);

      setSliderPriperties(roundNewClickPointtValue);
    }
  });
})();
