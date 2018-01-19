// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    htmlmin = require('gulp-htmlmin'),
    // md5 = require('gulp-md5-plus'),
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    replace = require('gulp-replace');

// Server
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
        host: '0.0.0.0'
    });
});

// Styles
gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .on('error', sass.logError)
        .pipe(autoprefixer('last 2 version'))
        .pipe(cssnano())
        .pipe(concat('all.css'))
        .pipe(minify())
        .pipe(rename({
            suffix: '.min'
        }))
        // .pipe(md5(10, 'dist/*.html', {
        //     connector: '.'
        // }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        // .pipe(md5(10, 'dist/*.html', {
        //     connector: '.'
        // }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
});

// Static
gulp.task('static', function () {
    return gulp.src('src/static/*')
        .pipe(gulp.dest('dist/static'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Html
gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(replace(/dist\/(?=styles.*?">|scripts.*?"><\/script>)/g, ''))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest('dist/'));
});

// Clean
gulp.task('clean', function () {
    return del('dist/');
});

// Build
gulp.task('build', ['clean'], function () {
    gulp.start('html', 'styles', 'scripts');
});

// Default task
gulp.task('default', function () {
    gulp.start('build');
});

// Watch
gulp.task('watch', ['clean', 'styles', 'scripts', 'server'], function () {
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    // Watch html files
    gulp.watch('*.html').on('change', browserSync.reload);
});
