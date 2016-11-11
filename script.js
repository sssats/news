(function () {
    'use strict';

    const API_KEY = 'c41606119eaa4f7096934765d567d115';
    const API_ARTICLES_URL = 'https://newsapi.org/v1/articles';
    const API_SOURCES_URL = 'https://newsapi.org/v1/sources';
    class Spinner {
        static show() {
            document.querySelector('.spinner').style.display = 'block';
        }

        static hide() {
            document.querySelector('.spinner').style.display = 'none';
        }

    }

    function renderSourcesSelect(sources) {
        let area = document.querySelector('.sources');
        let sourcesTemplate = '';
        for (let source of sources) {
            sourcesTemplate += `<a data-source-id="${source.id}"><img src="${source.urlsToLogos.small}" alt="${source.name}"></a>`;
        }

        area.innerHTML = sourcesTemplate
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
                `<div class="newsItem">
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
        Spinner.hide();
    }

    function getNews(sourceId) {
        fetch(`${API_ARTICLES_URL}?source=${sourceId}&apiKey=${API_KEY}`)
            .then(response => response.json())
            .then(json => renderNews(json.articles));
    }

    getSources();

    let sources = document.querySelector('.sources');

    sources.addEventListener('click', function (ev) {
        let sourceId;
        if (ev.target.tagName !== 'DIV') {
            Spinner.show();
            sourceId = ev.target.parentElement.getAttribute('data-source-id') ?
                ev.target.parentElement.getAttribute('data-source-id'): ev.target.getAttribute('data-source-id');
            getNews(sourceId);
        }
    });

})();