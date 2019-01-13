'use strict';
(function () {
  var CONTAINER_WIDTH = 453;
  var PROPORTION_MAX_VALUE = 100;
  var PROPORTION_MIN_VALUE = 0;
  var ROUNDING_VALUE = 100;
  var STEP = 10;
  var SLIDER_EFFECT_INPUT_DEFAULT = '100';

  var Filter = {
    'none': {
      class: 'effects__preview--none',
      cssProperty: 'none',
      units: '',
      maxValue: 1
    },
    'chrome': {
      class: 'effects__preview--chrome',
      cssProperty: 'grayscale',
      units: '',
      maxValue: 1
    },
    'sepia': {
      class: 'effects__preview--sepia',
      cssProperty: 'sepia',
      units: '',
      maxValue: 1
    },
    'marvin': {
      class: 'effects__preview--marvin',
      cssProperty: 'invert',
      units: '%',
      maxValue: 100
    },
    'phobos': {
      class: 'effects__preview--phobos',
      cssProperty: 'blur',
      units: 'px',
      maxValue: 3
    },
    'heat': {
      class: 'effects__preview--heat',
      cssProperty: 'brightness',
      units: '',
      maxValue: 3
    }
  };

  /**
   * Функция рассчитывает координаты пина слайдера
   * @function
   * @param {object} startingCoordinate координата пина на нуле.
   * @param {object} clickPoint точка клика evt.
   * @return {number} возвращает координаты пина от 0 до 100.
   */
  var getPinPoint = function (startingCoordinate, clickPoint) {
    var pinСoordinates = (clickPoint.clientX - startingCoordinate) * PROPORTION_MAX_VALUE / CONTAINER_WIDTH;

    if (pinСoordinates < PROPORTION_MIN_VALUE) {
      pinСoordinates = PROPORTION_MIN_VALUE;
    }

    if (pinСoordinates > PROPORTION_MAX_VALUE) {
      pinСoordinates = PROPORTION_MAX_VALUE;
    }

    return pinСoordinates;
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
   * Функция переводит координаты пина слайдера в проценты согласно пропорции.
   * @function
   * @param {number} PinPointValue координаты пина слайдера от 0 до 100.
   * @param {number} filterMaxValue максимальное значение фильтра для кртинки в единицах.
   * @return {number} возвращает координаты пина слайдера в процентах от filterMaxValue.
   */
  var returnPercent = function (PinPointValue, filterMaxValue) {
    return PinPointValue * (filterMaxValue / PROPORTION_MAX_VALUE);
  };

  /**
   * Функция добавляет картинке стили
   * @param {number} PinPointValue координаты пина слайдера
   * @param {object} image картинка, которой добавляются стили
   * @param {object} filterProperties данные о фильтре
   */
  var addFilters = function (PinPointValue, image, filterProperties) {
    var filterName = image.className.slice(image.className.indexOf('--') + 2);
    var filter = filterProperties[filterName];

    image.style.filter = filter.cssProperty + '(' + returnPercent(PinPointValue, filter.maxValue) + filter.units + ')';
  };

  /**
   * Функция скрывает слайдер для effects__preview--none.
   * @function
   * @param {object} image картинка, класс которой проверяем.
   * @param {object} slider объект, которому задается класс hidden
   */
  var hideSlider = function (image, slider) {
    if (image.classList.contains(Filter['none'].class)) {
      slider.classList.add('hidden');
    } else {
      slider.classList.remove('hidden');
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
   * Функция устанавливает объекту стиль left
   * @function
   * @param {object} tagName - объект, которому нужно добавить style.left
   * @param {number} styleValue - числовое значение left
   */
  var setStyleLeft = function (tagName, styleValue) {
    tagName.style.left = styleValue + '%';
  };

  /**
   * Функция устанавливает объекту стиль width
   * @function
   * @param {object} tagName - объект, которому нужно добавить style.width
   * @param {number} styleValue - числовое значение width
   */
  var setStyleWidth = function (tagName, styleValue) {
    tagName.style.width = styleValue + '%';
  };

  /**
   * Функция задает положение пина слайдера, добавляет фильтры картинке, задает инпуту effect-level__value значение интенсивности фильтра
   * @function
   * @param {number} pointPosition координаты пина слайдера
   */
  var setSliderProperties = function (pointPosition) {
    setStyleLeft(sliderPin, pointPosition);
    setStyleWidth(sliderEffectLevelDepth, pointPosition);
    addFilters(pointPosition, uploadImage, Filter);
    sliderEffect.setAttribute('value', pointPosition);
  };

  /**
   * Слушатель события клика для фильтров
   * @function
   * @param {event} evt
   */
  var filterClickHandler = function (evt) {
    if (evt.target.classList.contains('effects__radio')) {
      var effectLevelContainer = document.querySelector('.effect-level');

      Array.from(effectsList.querySelectorAll('.effects__radio')).forEach(function (input) {
        if (input.checked) {
          uploadImage.removeAttribute('class');
          uploadImage.classList.add(Filter[input.value].class);
          uploadImage.style.filter = null;
        }
      });

      hideSlider(uploadImage, effectLevelContainer);
      setStyleLeft(sliderPin, SLIDER_EFFECT_INPUT_DEFAULT);
      setStyleWidth(sliderEffectLevelDepth, SLIDER_EFFECT_INPUT_DEFAULT);
      sliderEffect.setAttribute('value', SLIDER_EFFECT_INPUT_DEFAULT);
    }
  };

  /**
   * Слушатель события Mousedown для пина слайдера
   * @function
   * @param {event} evt
   */
  var sliderPinMousedownHandler = function (evt) {
    var startPinPoint = getPinPoint(getLeftCoords(sliderLine), evt);

    /**
     * Слушатель события Mousemove для пина слайдера
     * @function
     * @param {event} moveEvt
     */
    var onMouseMove = function (moveEvt) {
      var shift = getPinPoint(getLeftCoords(sliderLine), moveEvt) - startPinPoint;
      var roundNewPinPointValue = roundNumber((startPinPoint + shift), ROUNDING_VALUE);

      setSliderProperties(roundNewPinPointValue);

      startPinPoint = getPinPoint(getLeftCoords(sliderLine), moveEvt);
    };

    /**
     * Слушатель события Mouseup для пина слайдера
     * @function
     * @param {event} moveEvt
     */
    var onMouseUp = function () {
      var roundStartPinPointValue = roundNumber(startPinPoint, ROUNDING_VALUE);

      setSliderProperties(roundStartPinPointValue);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /**
   * Слушатель события Keydown для пина слайдера
   * @function
   * @param {event} evt
   */
  var sliderPinKeydownHandler = function (evt) {
    var start = parseInt((sliderPin.style.left).slice(0, -1), 10);

    if (window.buttonCheck.left(evt)) {
      var nextPointLeft = start <= STEP ? PROPORTION_MIN_VALUE : start - STEP;

      setSliderProperties(nextPointLeft);
    }

    if (window.buttonCheck.right(evt)) {
      var nextPointRight = start >= (PROPORTION_MAX_VALUE - STEP) ? PROPORTION_MAX_VALUE : start + STEP;

      setSliderProperties(nextPointRight);
    }
  };

  /**
   * Слушатель события сlick для линии слайдера
   * @function
   * @param {event} evt
   */
  var sliderLineClickHandler = function (evt) {
    if (evt.target !== sliderPin) {
      var clickPoint = getPinPoint(getLeftCoords(sliderLine), evt);
      var roundNewClickPointtValue = roundNumber((clickPoint), ROUNDING_VALUE);

      setSliderProperties(roundNewClickPointtValue);
    }
  };

  var imgPreviewWrapper = document.querySelector('.img-upload__preview');
  var uploadImage = imgPreviewWrapper.querySelector('img');
  var effectsList = document.querySelector('.effects__list');
  var sliderEffect = document.querySelector('.effect-level__value');
  var sliderPin = document.querySelector('.effect-level__pin');
  var sliderLine = document.querySelector('.effect-level__line');
  var sliderEffectLevelDepth = document.querySelector('.effect-level__depth');

  window.slider = {
    filterClick: filterClickHandler,
    pinClick: sliderPinMousedownHandler,
    pinKeydown: sliderPinKeydownHandler,
    lineClick: sliderLineClickHandler,
    filter: Filter
  };
})();
