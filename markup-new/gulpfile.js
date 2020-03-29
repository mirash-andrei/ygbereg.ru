var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    notify = require('gulp-notify'),
    debug = require('gulp-debug'),
    browserSync = require('browser-sync').create(),
    watch = require('gulp-watch'),
    path = require('path'),
    fs = require('fs'),
    rename = require('gulp-rename'),

    imagemin = require('gulp-imagemin'),

    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js').createConfig,

    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),

    pug = require('gulp-pug'),
    emitty = require('emitty').setup('src', 'pug'),
    data = require('gulp-data');

/* BUILD */
gulp.task('build:fonts', () => {
    return gulp.src('src/fonts/!*.*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(debug({title: 'fonts copy'}));
});

/** Это старые картинки, от них нужно уйти */
gulp.task('build:img', () => {
    return gulp.src('src/img/**/*.*')
        .pipe(gulp.dest('dist/img'))
        .pipe(debug({title: 'img copy'}));
});

gulp.task('build:images', () => {
    return gulp.src('src/blocks/*/images/*.*')
        .pipe(plumber())
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('./dist/images'))
        .pipe(debug({title: 'images copy', showCount: false}));
});

/*gulp.task('build:sprite', function () {
    return buildSprite('src/blocks/!*!/icons/!*.svg');
});*/

gulp.task('build:markup', () => {
    return buildMarkup('src/pages/*.pug');
});

gulp.task('build:styles', () => {
    return buildStyles(['src/scss/main.scss', 'src/scss/pages/*.scss']);
});

gulp.task('build:scripts', (done) => {
    webpack(webpackConfig('development', 'build')).run((err, stats) => {
        buildScripts(err, stats, done);
    });
});

gulp.task('build:scripts:prod', (done) => {
    webpack(webpackConfig('production', 'build')).run((err, stats) => {
        buildScripts(err, stats, done);
    });
});

gulp.task('build', gulp.series(
    'build:fonts',
    'build:img',
    'build:images',
    //'build:sprite',
    'build:markup',
    'build:styles',
    'build:scripts'
));

gulp.task('build:prod', gulp.series(
    'build:styles',
    //'build:scripts',
    'build:scripts:prod'
));

/** COPY TO BITRIX */
gulp.task('copy:styles', () => {
    return gulp.src('./dist/css/**/*.css')
        .pipe(plumber())
        .pipe(gulp.dest('../www/local/templates/main/css'));
});

gulp.task('copy:scripts', () => {
    return gulp.src('./dist/js/**/*.js')
        .pipe(plumber())
        .pipe(gulp.dest('../www/local/templates/main/js'));
});

/** Копируем файлы в шаблон битрикса */
gulp.task('copy', gulp.series(
    'copy:styles',
    'copy:scripts',
));

gulp.task('prod', gulp.series(
    'build:prod',
    'copy'
));

/** WATCH */

// todo watch fonts

gulp.task('watch:images', () => {
    return watch('src/blocks/*/images/*.*', (file) => {
        if (file.event === 'add' || file.event === 'change') {
            imageMin(file.path);
        } else if (file.event === 'unlink') {
            fs.unlink(path.resolve('dist/images/' + path.basename(file.path)), (err) => {
            });
        }
    });
});

/*gulp.task('watch:sprite', () => {
    return watch('src/blocks/!*!/icons/!*.svg', () => {
        return buildSprite('src/blocks/!*!/icons/!*.svg')
            .pipe(browserSync.stream());
    });
});*/

// отслеживание изменений в pug
gulp.task('watch:markup', () => {
    return watch('src/pages/*.pug', (file) => {
        return buildMarkup(file.path)
            .pipe(browserSync.stream());
    });
});

gulp.task('watch:markup:blocks', () => {
    return watch('src/blocks/*/*.pug', (file) => {
        let filePath = file.path.replace(file.cwd + '/', '');

        return buildMarkupWithCache(filePath)
            .pipe(browserSync.stream());
    });
});

gulp.task('watch:markup:template', () => {
    return watch('src/template/*.pug', (file) => {
        let filePath = file.path.replace(file.cwd + '/', '');

        return buildMarkupWithCache(filePath)
            .pipe(browserSync.stream());
    });
});

gulp.task('watch:styles', () => {
    return watch('src/scss/**/*.scss', () => {
        return buildStyles(['src/scss/main.scss', 'src/scss/pages/*.scss'])
            .pipe(browserSync.stream());
    });
});

gulp.task('watch:styles:blocks', () => {
    return watch('src/blocks/*/style.scss', () => {
        return buildStyles(['src/scss/main.scss', 'src/scss/pages/*.scss'])
            .pipe(browserSync.stream());
    });
});

gulp.task('watch:scripts', function () {
    webpack(webpackConfig('development', 'watch')).watch({
        aggregateTimeout: 100,
        poll: false,
        ignored: ['node_modules']
    }, buildScripts);
});

gulp.task('watch:data', () => {
    return gulp.watch(['src/data.json'], () => {
        return buildMarkup('src/pages/*.pug')
            .pipe(browserSync.stream());
    });
});

gulp.task('watch', gulp.parallel(
    'watch:images',
    //'watch:sprite',
    'watch:markup',
    'watch:markup:blocks',
    'watch:markup:template',
    'watch:styles',
    'watch:styles:blocks',
    'watch:scripts',
    'watch:data'
));

gulp.task('webserver', (done) => {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        tunnel: false,
        host: '',
        port: 9000,
        logPrefix: 'template'
    });

    done();
});

gulp.task('imagemin', () => {
    return imageMin('src/blocks/*/images/*.*');
});

// действия по умолчанию при запуске gulp
gulp.task('default', gulp.parallel('watch', 'webserver'));

function imageMin(files) {
    return gulp.src(files, {base: './'})
        .pipe(plumber())
        .pipe(debug({title: 'image min'}))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false,
                    collapseGroups: true
                }]
            })
        ]))
        .pipe(gulp.dest('./'))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('./dist/images'));
}

function buildMarkup(files) {
    return gulp.src(files)
        .pipe(plumber())
        .pipe(data(() => JSON.parse(fs.readFileSync('./src/data.json'))))
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('dist'))
        .pipe(debug({title: 'build'}));
}

function buildMarkupWithCache(filePath) {
    return gulp.src('src/pages/*.pug')
        .pipe(plumber())
        .pipe(emitty.stream())
        .pipe(data(() => JSON.parse(fs.readFileSync('./src/data.json'))))
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('dist'))
        .pipe(debug({title: 'build', showCount: false}))
}

function buildStyles(files) {
    return gulp.src(files, {base: './src/scss/'})
        .pipe(plumber())
        .pipe(sass({
            //includePaths: ['src/style/', 'src/blocks/!**'],
            outputStyle: 'expanded',
            sourceMap: false,
            errLogToConsole: true
        }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest('dist/css'))
        .pipe(debug({title: 'scss build', showCount: false}));
}

function buildScripts(err, stats, done) {
    let errors = stats.compilation.errors;

    if (err) throw new gutil.PluginError('webpack', err);

    if (errors.length > 0) {
        notify.onError({
            title: 'Webpack Error',
            message: '<%= error.message %>',
            sound: 'Submarine'
        }).call(null, errors[0]);
    }

    browserSync.reload();

    if (typeof done === 'function') done();
}