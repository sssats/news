'use strict';

import 'babel-polyfill';
import 'whatwg-fetch';
import News from './News.js';
import Spinner from './Spinner.js';


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
