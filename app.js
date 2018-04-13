let btnSearch = document.querySelector('.btn__search');
let search = document.querySelector('.search');
let input = document.querySelector('.search__input');
let result = document.querySelector('.results__template').content.querySelector('.result');
let resultsList = document.querySelector('.results__list');

const urlWiki = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&utf8=1&srenablerewrites=1&srlimit=10&srsearch=';
const urlArticle = 'https://en.wikipedia.org/?curid=';

btnSearch.addEventListener('click', getResponse);

input.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) getResponse();
});

function getResponse() {
  if (!input.value) return;

  fetch(urlWiki + input.value)
    .then(checkStatus)
      .then(parseJSON)
        .then(getList)
          .catch(error => alert(error));
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

function renderData(data) {
  let resultEl = result.cloneNode(true);
  let resultText = resultEl.querySelector('.result__text');
  let resultLink = resultEl.querySelector('.result__link');

  let urlA = urlArticle + data.pageid;

  resultLink.setAttribute('href', urlA);
  resultLink.textContent = data.title;
  resultText.innerHTML = data.snippet;

  return resultEl;
}

function changeStyle() {
  if (resultsList.innerHTML) resultsList.innerHTML = '';
  search.classList.add('change');
}

function getList(json) {
  let fragment = document.createDocumentFragment();
  let arr = json.query.search;

  changeStyle();
  
  for (let i of arr) {
    fragment.appendChild(renderData(i));
  }
  resultsList.appendChild(fragment);
}

