var testComments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var testDescriptions = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];

/* Функция для случайного числа в промежутке */

var getRandomArbitrary = function (min, max) {
  var a = Math.random() * (max - min) + min;
  return Math.round(a);
};

var objectsList = [];  //пустой массив объектов

var createObject = function (i) {
  var newObject = {
    url: 'photos/' + i + '.jpg',
    likes: getRandomArbitrary(15, 200),
    comments: randomComments(testComments),
    description: testDescriptions[getRandomArbitrary(1, 6) - 1]
  };
  objectsList.push(newObject);
};

//функция для создания нескольких объектов

var createArray = function (totalObjects) {
  i = 1;
  while (i <= totalObjects) {
    createObject(i);
    i++;
  }
};

//функция для создания рандомного количества комментариев

var randomComments = function (testComments) {
  var asd = getRandomArbitrary(1, 2);
  var i = 0;
  var commentsTotal = [];
  while (i < asd) {
    commentsTotal.push(testComments[getRandomArbitrary(1, 6) - 1]);
    i++;
  }
  return commentsTotal;
};

// нахожу template #picture
var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

// функция для генерации dom-объекта и записи в него данных из массива objectsList
var renderPicture = function (userArray) {
  var pictureItem = pictureTemplate.cloneNode(true);
  pictureItem.querySelector('.picture__img').src = userArray.url;
  pictureItem.querySelector('.picture__likes').textContent = userArray.likes;
  pictureItem.querySelector('.picture__comments').textContent = userArray.comments.length;
  return pictureItem;
};

//переменная, куда будем вставлять картинки
var picturesList = document.querySelector('.pictures');

// создаем фрагмент
var fragment = document.createDocumentFragment();

// функция записывает элементы в фрагмент
var writeElements = function (userArray) {
  for (i = 0; i < userArray.length; i++) {
    fragment.appendChild(renderPicture(userArray[i]));
  }
};

// рисуем фрагмент в блоке (задать через place куда)
var drawFragment = function (place) {
  place.appendChild(fragment);
};

/* Создаю массив из 25 объектов и рисую его в блоке .picture */
createArray(25);
writeElements(objectsList);
drawFragment(picturesList);
document.querySelector('.big-picture').classList.remove('hidden');

// переменная для big-picture
var bigPicture = document.querySelector('.big-picture');

// функция для заполнения big-picture
var renderBigPicture = function (userArray) {
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = userArray.url;
  bigPicture.querySelector('.likes-count').textContent = userArray.likes;
  bigPicture.querySelector('.comments-count').textContent = userArray.comments.length;
  bigPicture.querySelector('.social__caption').textContent = userArray.description;
};

renderBigPicture(objectsList[0]);

var commentsList = bigPicture.querySelector('.social__comments');

// функция генерирует разметку для комментов во фрагмент, вставляет текст комментов объектов массива и записывает куда надо
// userArray - массив из которого берутся комменты, place - путь, куда вставляется фрагмент
var renderComments = function (userArray, place) {
  for (i = 0; i < userArray.comments.length; i++) {
    var newElement = document.createElement('li');
    newElement.className = 'social__comment';
    newElement.innerHTML = '<img class="social__picture" src="img/avatar-' + getRandomArbitrary(1, 6) + '.svg" alt="Аватар комментатора фотографии" width="35" height="35">' + '<p class="social__text">' + userArray.comments[i] + '</p>';
    fragment.appendChild(newElement);
  }
  place.appendChild(fragment);
}

renderComments(objectsList[0], commentsList);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
