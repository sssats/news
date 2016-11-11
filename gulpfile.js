var gulp = require('gulp'),
    async = require('async'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
});

gulp.task('watch', function () {
    gulp.watch('./scss/**/*.scss', ['sass']);
});


gulp.task('default', ['sass', 'watch'], function () {
});