import News from './News.js';

class NewsFactory {
    static create(type, source) {
        return new News(type, source);
    }
}

export default NewsFactory;