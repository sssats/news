import config from './config';
import Spinner from './Spinner.js';
import {renderFacade, newsArr} from './render.facade'

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
    }

    static getApiData(url) {
        return fetch(url)
            .then(response => response.json())
            .then(json => json);
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

    static getSources() {
        this.getApiData(`${config.API_SOURCES_URL}?language=en`)
            .then(json => {
                renderFacade.facadeParseSources(json.sources);
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
            renderFacade.facadeParseNews(newsArr[sourceId].getData().data, false);
        } else {
            this.getApiData(`${config.API_ARTICLES_URL}?source=${sourceId}&apiKey=${config.API_KEY}`)
                .then(json => renderFacade.facadeParseNews(json))
                .catch(error => {
                    console.log(error);
                    Spinner.hide();
                });
        }
    }
}

export default News;
