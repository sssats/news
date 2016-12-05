import renderFacade from './render.facade';

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

    static getSources() {
        renderFacade.showSource();
    }

    static getNews(sourceId) {
        renderFacade.showNews(sourceId);
    }
}

export default News;
