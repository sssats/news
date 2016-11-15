'use strict';

const API_KEY = 'c41606119eaa4f7096934765d567d115';
const API_ARTICLES_URL = 'https://newsapi.org/v1/articles';
const API_SOURCES_URL = 'https://newsapi.org/v1/sources';

let sourcesArr = [];
let newsArr = [];

let loggingService = new Proxy(newsArr, {
    get(target, prop) {
        console.log(`Reading ${prop}`);
        return target[prop];
    },
    set(target, prop, value) {
        console.log(`Saving ${prop} ${value}`);
        target[prop] = value;
        return true;
    }
});

class Spinner {
    static show() {
        document.querySelector('.spinner').style.display = 'block';
    }

    static hide() {
        document.querySelector('.spinner').style.display = 'none';
    }

    static hideNews() {
        document.querySelector('.spinner').classList.add('hideNews');
    }

}

class News {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    getData() {
        return {
            type: this.type,
            data: this.data
        }
    };

    static getApiData(url) {
        return fetch(url)
            .then(response => response.json())
            .then(json => json);
    }

    static getSources() {
        this.getApiData(`${API_SOURCES_URL}?language=en`)
            .then(json => {
                this.parseSources(json.sources);
                return json;
            })
            .catch(error => {
                console.log(error);
                Spinner.hide();
            })
            .then(json => this.getNews(json.sources[0].id))
            .catch(error => {
                console.log(error);
                Spinner.hide();
            });
    }

    static getNews(sourceId) {
        if (newsArr[sourceId]) {
            this.parseNews(newsArr[sourceId].getData().data, false);
        } else {
            this.getApiData(`${API_ARTICLES_URL}?source=${sourceId}&apiKey=${API_KEY}`)
                .then(json => this.parseNews(json))
                .catch(error => {
                    console.log(error);
                    Spinner.hide();
                });
        }
    }


    static parseSources(sources) {
        let sourcesTemplate = '';
        for (let source of sources) {
            sourcesArr[source.id] = new News('source', source);
            sourcesTemplate +=
                `<a data-source-id="${source.id}">
                        <img src="${source.urlsToLogos.small}" alt="${source.name}"/>
                        <span>${source.name}</span>
                    </a>`;
        }
        this.renderSources(sourcesTemplate);
    }

    static parseNews(news, isNewNewsItem = true) {
        let newsTemplate = '';

        if (isNewNewsItem) {
            loggingService[news.source] = new News('news', news)
        }

        for (let newsItem of news.articles) {
            newsTemplate +=
                `<article class="newsItem">
                    <header>
                        <img src="${newsItem.urlToImage}" alt="${newsItem.title}">
                        <h4><a href="${newsItem.url}">${newsItem.title}</a></h4>
                    </header>
                    <p class="newsDescription">${newsItem.description}</p>
                </article>`
        }
        this.renderNews(newsTemplate, sourcesArr[news.source].getData().data);
    }

    static renderNews(newsTemplate, source) {
        let area = document.querySelector('.newsWrapper');
        document.querySelector('#sourceName').innerHTML = source.name;
        document.querySelector('#sourceDescription').innerHTML = source.description;
        area.innerHTML = '';
        area.innerHTML = newsTemplate;

        Spinner.hide();
    }

    static renderSources(sourcesTemplate) {
        let area = document.querySelector('.sources');
        area.innerHTML = sourcesTemplate;
        document.querySelector('.sources a').classList.add('active');
        Spinner.hideNews();
    }
}

News.getSources();

let sources = document.querySelector('.sources');

sources.addEventListener('click', function (ev) {
    let el;
    if (ev.target.tagName !== 'DIV') {
        Spinner.show();
        document.querySelector('.sources .active').classList.remove('active');
        el = ev.target.parentElement.getAttribute('data-source-id') ?
            ev.target.parentElement : ev.target;
        el.classList.add('active');
        News.getNews(el.getAttribute('data-source-id'));
    }
});

document.querySelector('#nav').addEventListener('click', function () {
    var html = document.querySelector('html');
    if (html.classList.contains('menuOpened')) {
        document.querySelector('html').classList.remove('menuOpened');
    } else {
        document.querySelector('html').classList.add('menuOpened');
    }
});
