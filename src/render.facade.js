import config from './config';
import Spinner from './Spinner.js';
import createNewsFactory from './createNews.factory'

let sourcesArr = [];
let newsArr = [];

class renderFacade {

    static getApiData(url) {
        return fetch(url)
            .then(response => response.json())
            .then(json => json);
    }

    static showSource() {
        this.getApiData(`${config.API_SOURCES_URL}?language=en`)
            .then(json => {
                this.parseSources(json.sources);
                return json;
            })
            .catch(error => {
                console.log(error);
                Spinner.hide();
            })
            .then(json => this.showNews(json.sources[0].id))
            .catch(error => {
                console.log(error);
                Spinner.hide();
            });
    }

    static showNews(sourceId) {
        if (newsArr[sourceId]) {
            this.parseNews(newsArr[sourceId].getData().data, false);
        } else {
            this.getApiData(`${config.API_ARTICLES_URL}?source=${sourceId}&apiKey=${config.API_KEY}`)
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
            sourcesArr[source.id] = createNewsFactory('source', source);
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
            newsArr[news.source] = createNewsFactory('news', news)
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

export default renderFacade;