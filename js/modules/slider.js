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
    var containerWidth = 453;
    var proportionMaxValue = 100;
    var proportionMinValue = 0;
    var saturationValue = (clickPoint.clientX - startingCoordinate) * proportionMaxValue / containerWidth;
    if (saturationValue < proportionMinValue) {
      saturationValue = proportionMinValue;
    }
    if (saturationValue > proportionMaxValue) {
      saturationValue = proportionMaxValue;
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
    var proportionMaxValue = 100;
    var percent = PinPointValue * (filterMaxValue / proportionMaxValue);
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
   * @param {object} ClassNames - объект с классами тега
   * @param {object} cssPropertiesList - объект с названиями фильтров и их максимальными значениями
   */
  var addAllFilters = function (PinPointValue, checkedTag, ClassNames, cssPropertiesList) {
    switch (checkedTag.className) {
      case ClassNames.none:
        break;
      case ClassNames.chrome:
        addFilterName(checkedTag, cssPropertiesList.chrome, returnPercent(PinPointValue, cssPropertiesList.chromeMaxValue));
        break;
      case ClassNames.sepia:
        addFilterName(checkedTag, cssPropertiesList.sepia, returnPercent(PinPointValue, cssPropertiesList.sepiaMaxValue));
        break;
      case ClassNames.marvin:
        addFilterName(checkedTag, cssPropertiesList.marvin, PinPointValue, true);
        break;
      case ClassNames.phobos:
        addFilterName(checkedTag, cssPropertiesList.phobos, returnPercent(PinPointValue, cssPropertiesList.phobosMaxValue), false, true);
        break;
      case ClassNames.heat:
        addFilterName(checkedTag, cssPropertiesList.heat, returnPercent(PinPointValue, cssPropertiesList.heatMaxValue));
        break;
      default:
        break;
    }
  };
  /**
   * Функция сбрасывает имя класса до пустой строки ('').
   * @function
   * @param {object} resetArgument элемент, которому сбрасывается класс
   */
  var resetClassName = function (resetArgument) {
    resetArgument.className = '';
  };
  /**
   * Функция обрезает id элемента так, как нужно.
   * @function
   * @param {event} checkedEvent проверяемый элемент.
   * @return {string} возвращает измененный id.
   */
  var sliceIdName = function (checkedEvent) {
    return checkedEvent.target.id.slice(0, 6) + 's__preview--' + checkedEvent.target.id.slice(7);
  };
  /**
   * Функция скрывает слайдер для effects__preview--none.
   * @function
   * @param {object} checkedArgument параметр, класс которого проверяем.
   * @param {object} mustBeHidden параметр, который должен быть скрыт.
   */
  var hideSlider = function (checkedArgument, mustBeHidden) {
    if (checkedArgument.classList.contains('effects__preview--none')) {
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
  var filterCssProperties = {
    none: 'none',
    noneMaxValue: 1,
    chrome: 'grayscale',
    chromeMaxValue: 1,
    sepia: 'sepia',
    sepiaMaxValue: 1,
    marvin: 'invert',
    marvinMaxValue: 1,
    phobos: 'blur',
    phobosMaxValue: 3,
    heat: 'brightness',
    heatMaxValue: 3
  };
  var filterClassNames = {
    none: 'effects__preview--none',
    chrome: 'effects__preview--chrome',
    sepia: 'effects__preview--sepia',
    marvin: 'effects__preview--marvin',
    phobos: 'effects__preview--phobos',
    heat: 'effects__preview--heat'
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
      resetClassName(uploadImage);
      window.changeClass.add(uploadImage, newClass);
      hideSlider(uploadImage, effectLevelContainer);
      setStyleLeft(sliderPin, sliderEffectInputDefault);
      setStyleWidth(sliderEffectLevelDepth, sliderEffectInputDefault);
      window.changeAttribute.set(sliderEffect, 'value', sliderEffectInputDefault);
      window.changeAttribute.remove(uploadImage, 'style');
    }
  });

  sliderPin.addEventListener('mousedown', function (evt) {
    var startPinPoint = getPinPoint(getLeftCoords(sliderLine), evt);
    var sliderEffectLevelDepth = document.querySelector('.effect-level__depth');
    var roundingValue = 100;
    var onMouseMove = function (moveEvt) {
      var shift = getPinPoint(getLeftCoords(sliderLine), moveEvt) - startPinPoint;
      var roundNewPinPointValue = roundNumber((startPinPoint + shift), roundingValue);
      setStyleLeft(sliderPin, roundNewPinPointValue);
      setStyleWidth(sliderEffectLevelDepth, roundNewPinPointValue);
      window.changeAttribute.set(sliderEffect, 'value', roundNewPinPointValue);
      addAllFilters(startPinPoint, uploadImage, filterClassNames, filterCssProperties);
      startPinPoint = getPinPoint(getLeftCoords(sliderLine), moveEvt);
    };
    var onMouseUp = function () {
      var roundStartPinPointValue = roundNumber(startPinPoint, roundingValue);
      setStyleLeft(sliderPin, roundStartPinPointValue);
      setStyleWidth(sliderEffectLevelDepth, roundStartPinPointValue);
      window.changeAttribute.set(sliderEffect, 'value', roundStartPinPointValue);
      addAllFilters(startPinPoint, uploadImage, filterClassNames, filterCssProperties);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
