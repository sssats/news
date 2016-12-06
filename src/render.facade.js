import News from './News';
import NewsFactory from './createNews.factory'

var sourcesArr = [];
var newsArr = [];

function parseSources(sources) {
    let sourcesTemplate = '';
    for (let source of sources) {
        sourcesArr[source.id] = NewsFactory.create('source', source);
        sourcesTemplate +=
            `<a data-source-id="${source.id}">
                        <img src="${source.urlsToLogos.small}" alt="${source.name}"/>
                        <span>${source.name}</span>
                    </a>`;
    }

    return sourcesTemplate;
}

function parseNews(news, isNewNewsItem = true) {

    let newsTemplate = '';

    if (isNewNewsItem) {
        newsArr[news.source] = NewsFactory.create('news', news)
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

    return {
        news: news,
        newsTemplate: newsTemplate
    };
}

class renderFacade {

    static facadeParseSources(sources) {
        var sourcesTemplate = parseSources(sources);
        News.renderSources(sourcesTemplate);
    }

    static facadeParseNews(sourceId) {
        var newsData = parseNews(sourceId);
        News.renderNews(newsData.newsTemplate, sourcesArr[newsData.news.source].getData().data);
    }
}

export {renderFacade, sourcesArr, newsArr};