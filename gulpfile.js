// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sequence = require('gulp-sequence'),
    print = require('gulp-print'),
    replace = require('gulp-replace'),
    gulpif = require('gulp-if'),
    del = require('del'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    md5 = require('gulp-md5-plus'),

    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),

    browserify = require('browserify'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify-es').default,
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    htmlmin = require('gulp-htmlmin');

var browsersList = [
    'last 2 major version',
    '>= 1%',
    'Chrome >= 45',
    'Firefox >= 38',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 9',
    'Safari >= 8',
    'Android >= 4.4',
    'Opera >= 30'
];

var isBuildTask = ['build', 'default'].indexOf(process.argv.slice(2)[0] || 'default') > -1;

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
    return gulp.src('src/scss/all.scss')
        .pipe(gulpif(!isBuildTask, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .on('error', sass.logError)
        .pipe(postcss(
            [
                autoprefixer(browsersList),
                cssnano()
            ]
        ))
        .pipe(print())
        // .pipe(concat('all.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpif(isBuildTask, md5(10, 'dist/*.html', {
            connector: '.'
        })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function () {
    var b = browserify({
        entries: 'src/scripts/entry.js',
        debug: !isBuildTask,
        transform: [
            [babelify, {
                'presets': [
                    ['env', {
                        'targets': {
                            'browsers': browsersList
                        },
                        debug: !isBuildTask
                    }]
                ]
            }]
        ]
    });
    return b.bundle()
        .on('error', function (err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(print())
        .pipe(gulpif(!isBuildTask, sourcemaps.init({
            loadMaps: true
        }))) //[loadMaps: true] must be enabled
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpif(isBuildTask, md5(10, 'dist/*.html', {
            connector: '.'
        })))
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
gulp.task('build', sequence('clean', 'html', ['styles', 'scripts']));

// Default task
gulp.task('default', ['build']);

// Watch
gulp.task('_watch_assets', sequence('clean', ['styles', 'scripts'], 'server'));
gulp.task('watch', ['_watch_assets'], function () {
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    // Watch html files
    gulp.watch('*.html').on('change', browserSync.reload);
});
