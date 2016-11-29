let start = document.querySelector('.start');
import '../scss/style.scss';

start.addEventListener('click', function (ev) {
    require.ensure([], function () {
        require('./script');
    });
});