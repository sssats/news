(function () {
    'use strict';

    const API_KEY = 'c41606119eaa4f7096934765d567d115';
    const API_ARTICLES_URL = 'https://newsapi.org/v1/articles';
    const API_SOURCES_URL = 'https://newsapi.org/v1/sources';

    function renderSourcesSelect(sources) {
        let area = document.querySelector('.sourceSelectWrapper span');
        let select = document.createElement('select');
        let sourcesTemplate = '';
        select.setAttribute('id', 'newsSources');

        for (let source of sources) {
            sourcesTemplate += `<option value="${source.id}" data-source-url="${source.url}">${source.name}</option>`;
        }

        select.innerHTML = sourcesTemplate;

        area.appendChild(select);
    }

    function getSources() {
        fetch(`${API_SOURCES_URL}?language=en`)
            .then(response => response.json())
            .then(json => {
                renderSourcesSelect(json.sources);
                return json;
            })
            .then(json => getNews(json.sources[0].id));
    }

    function renderNews(news) {
        let area = document.querySelector('.newsWrapper');
        area.innerHTML = '';
        let newsTemplate = '';

        for (let newsItem of news) {
            newsTemplate +=
                `<div class="news-item">
                    <img src="${newsItem.urlToImage}" alt="${newsItem.title}">
                    <div class="wrapper">
                        <h4><a href="${newsItem.url}">${newsItem.title}</a></h4>
                        <p>${newsItem.description}</p>
                        <div class="meta">
                            <span>${newsItem.publishedAt}</span>
                            <span>${newsItem.author}</span>
                        </div>
                    </div>
                </div>`
        }

        area.innerHTML = newsTemplate;
    }

    function getNews(sourceId) {
        fetch(`${API_ARTICLES_URL}?source=${sourceId}&apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(json => renderNews(json.articles));
    }

    getSources();

    let loadNewsButton = document.querySelector('#loadNews');

    loadNewsButton.addEventListener('click', function () {
        let select = document.querySelector('#newsSources');
        let sourceId = select.options[select.selectedIndex].value;

        getNews(sourceId);
    });

})();