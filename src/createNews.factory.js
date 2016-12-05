import News from './News.js';

function createNewsFactory(type, source) {
    console.log(`Factory create ${type}`)
    return new News(type, source);
};

export default createNewsFactory;