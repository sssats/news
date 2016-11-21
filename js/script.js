'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_KEY = 'c41606119eaa4f7096934765d567d115';
var API_ARTICLES_URL = 'https://newsapi.org/v1/articles';
var API_SOURCES_URL = 'https://newsapi.org/v1/sources';

var sourcesArr = [];
var newsArr = [];

var Spinner = function () {
    function Spinner() {
        _classCallCheck(this, Spinner);
    }

    _createClass(Spinner, null, [{
        key: 'show',
        value: function show() {
            document.querySelector('.spinner').style.display = 'block';
        }
    }, {
        key: 'hide',
        value: function hide() {
            document.querySelector('.spinner').style.display = 'none';
        }
    }, {
        key: 'hideNews',
        value: function hideNews() {
            document.querySelector('.spinner').classList.add('hideNews');
        }
    }]);

    return Spinner;
}();

var News = function () {
    function News(type, data) {
        _classCallCheck(this, News);

        this.type = type;
        this.data = data;
    }

    _createClass(News, [{
        key: 'getData',
        value: function getData() {
            return {
                type: this.type,
                data: this.data
            };
        }
    }], [{
        key: 'getApiData',
        value: function getApiData(url) {
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (json) {
                return json;
            });
        }
    }, {
        key: 'getSources',
        value: function getSources() {
            var _this = this;

            this.getApiData(API_SOURCES_URL + '?language=en').then(function (json) {
                _this.parseSources(json.sources);
                return json;
            }).catch(function (error) {
                console.log(error);
                Spinner.hide();
            }).then(function (json) {
                return _this.getNews(json.sources[0].id);
            }).catch(function (error) {
                console.log(error);
                Spinner.hide();
            });
        }
    }, {
        key: 'getNews',
        value: function getNews(sourceId) {
            var _this2 = this;

            if (newsArr[sourceId]) {
                this.parseNews(newsArr[sourceId].getData().data, false);
            } else {
                this.getApiData(API_ARTICLES_URL + '?source=' + sourceId + '&apiKey=' + API_KEY).then(function (json) {
                    return _this2.parseNews(json);
                }).catch(function (error) {
                    console.log(error);
                    Spinner.hide();
                });
            }
        }
    }, {
        key: 'parseSources',
        value: function parseSources(sources) {
            var sourcesTemplate = '';
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var source = _step.value;

                    sourcesArr[source.id] = new News('source', source);
                    sourcesTemplate += '<a data-source-id="' + source.id + '">\n                        <img src="' + source.urlsToLogos.small + '" alt="' + source.name + '"/>\n                        <span>' + source.name + '</span>\n                    </a>';
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.renderSources(sourcesTemplate);
        }
    }, {
        key: 'parseNews',
        value: function parseNews(news) {
            var isNewNewsItem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var newsTemplate = '';

            if (isNewNewsItem) {
                newsArr[news.source] = new News('news', news);
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = news.articles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var newsItem = _step2.value;

                    newsTemplate += '<article class="newsItem">\n                    <header>\n                        <img src="' + newsItem.urlToImage + '" alt="' + newsItem.title + '">\n                        <h4><a href="' + newsItem.url + '">' + newsItem.title + '</a></h4>\n                    </header>\n                    <p class="newsDescription">' + newsItem.description + '</p>\n                </article>';
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.renderNews(newsTemplate, sourcesArr[news.source].getData().data);
        }
    }, {
        key: 'renderNews',
        value: function renderNews(newsTemplate, source) {
            var area = document.querySelector('.newsWrapper');
            document.querySelector('#sourceName').innerHTML = source.name;
            document.querySelector('#sourceDescription').innerHTML = source.description;
            area.innerHTML = '';
            area.innerHTML = newsTemplate;

            Spinner.hide();
        }
    }, {
        key: 'renderSources',
        value: function renderSources(sourcesTemplate) {
            var area = document.querySelector('.sources');
            area.innerHTML = sourcesTemplate;
            document.querySelector('.sources a').classList.add('active');
            Spinner.hideNews();
        }
    }]);

    return News;
}();

News.getSources();

var sources = document.querySelector('.sources');

sources.addEventListener('click', function (ev) {
    var el = void 0;
    if (ev.target.tagName !== 'DIV') {
        Spinner.show();
        document.querySelector('.sources .active').classList.remove('active');
        el = ev.target.parentElement.getAttribute('data-source-id') ? ev.target.parentElement : ev.target;
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