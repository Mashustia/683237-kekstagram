'use strict';

(function () {
  var SEND_FORM_URL = 'https://js.dump.academy/kekstagram';
  var GET_DATA_URL = 'https://js.dump.academy/kekstagram/data';
  var HTTP_STATUS_CODE_200 = 200;
  var TIMEOUT = 10000;
  var RESPONSE_STATUS = 'Статус ответа: ';
  var ERROR_MESSAGE = 'Произошла ошибка соединения';
  var ERROR_TIMEOUT = {
    message: 'Запрос не успел выполниться за ',
    units: 'мс'
  };

  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_CODE_200) {
        onLoad(xhr.response);
      } else {
        onError(RESPONSE_STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('POST', SEND_FORM_URL);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_CODE_200) {
        onLoad(xhr.response);
      } else {
        onError(RESPONSE_STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ERROR_MESSAGE);
    });
    xhr.addEventListener('timeout', function () {
      onError(ERROR_TIMEOUT.message + xhr.timeout + ERROR_TIMEOUT.units);
    });

    xhr.timeout = TIMEOUT; // 10s

    xhr.open('GET', GET_DATA_URL);
    xhr.send();
  };

  window.server = {
    load: load,
    upload: upload
  };
})();
