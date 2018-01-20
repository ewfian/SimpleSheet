// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sequence = require('gulp-sequence'),
    print = require('gulp-print'),
    replace = require('gulp-replace'),
    del = require('del'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    // md5 = require('gulp-md5-plus'),

    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),

    browserify = require('browserify'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify-es').default,
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    htmlmin = require('gulp-htmlmin');


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
        .pipe(print())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .on('error', sass.logError)
        .pipe(postcss(
            [
                autoprefixer(['last 2 versions', 'safari >= 7']),
                cssnano()
            ]
        ))
        .pipe(concat('all.css'))
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
    var b = browserify({
        entries: 'src/scripts/entry.js',
        debug: true,
        transform: [
            [babelify, {
                'presets': [
                    ['env', {
                        'targets': {
                            'browsers': ['last 2 versions', 'safari >= 7']
                        },
                        debug: true
                    }]
                ]
            }]
        ]
    });
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(print())
        .pipe(sourcemaps.init({
            loadMaps: true
        })) //[loadMaps: true] must be enabled
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

// Common
gulp.task('_assets', sequence('clean', ['styles', 'scripts']));

// Build
gulp.task('build', sequence('_assets', 'html'));

// Default task
gulp.task('default', ['build']);

// Watch
gulp.task('watch', ['_assets', 'server'], function () {
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    // Watch html files
    gulp.watch('*.html').on('change', browserSync.reload);
});
