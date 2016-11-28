import Spinner from './Spinner.js';

let sourcesArr = [];
let newsArr = [];

const API_KEY = 'c41606119eaa4f7096934765d567d115';
const API_ARTICLES_URL = 'https://newsapi.org/v1/articles';
const API_SOURCES_URL = 'https://newsapi.org/v1/sources';

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
            newsArr[news.source] = new News('news', news)
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

export default News;
