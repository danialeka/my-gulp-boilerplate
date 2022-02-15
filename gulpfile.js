const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const {
    src,
    series,
    parallel,
    dest,
    watch
} = require('gulp');


const jsPath = 'src/js/**/*.js';
const cssPath = 'src/css/**/*.css';

function copyHtml() {
    return src('src/*.html').pipe(gulp.dest('dist'));
}

function imgTask() {
    return src('src/assets/*').pipe(imagemin()).pipe(gulp.dest('dist/assets'));
}

function jsTask() {
    return src(jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/assets/js'));
}

function cssTask() {
    return src(cssPath)
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(postcss([autoprefixer(), cssnano]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/assets/css'));
}

function compile() {
    return src("src/scss/main.scss", {
            sourcemaps: true
        })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename("main.min.css"))
        .pipe(dest("dist/css", {
            sourcemaps: "."
        }));
}

function watcher() {
    watch(["*.html"], series(html, syncReload));
    watch(["src/img/*"], series(images, syncReload));
    watch(["src/scss/**/*.scss"], series(compile, syncReload));
}
exports.cssTask = cssTask;
exports.jsTask = jsTask;
exports.imgTask = imgTask;
exports.copyHtml = copyHtml;
exports.default = copyHtml;