var gulp = require('gulp'),
    async = require('async'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require("gulp-babel");

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
});

gulp.task("babel", function () {
    return gulp.src("src/script.js")
        .pipe(babel())
        .pipe(gulp.dest("./"));
});

gulp.task('watch', function () {
    gulp.watch('./scss/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.js', ['babel']);
});


gulp.task('default', ['babel', 'sass', 'watch'], function () {
});