// Модули для работы --------------------------------------------------------------------

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    del = require('del'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    csso = require('gulp-csso'),
    pug = require('gulp-pug');

// Работа со Stylus --------------------------------------------------------------------

gulp.task('stylus', function() {
    return gulp.src([
            'dev/static/stylus/main.styl',
        ])
        .pipe(stylus({
            'include css': true,
        }))
        .pipe(autoprefixer(['last 2 version']))
        // .pipe(csso())
        .pipe(gulp.dest('dev/static/css'))
        .pipe(browserSync.stream());
});

gulp.task('stylusMin', function() {
    return gulp.src([
            'dev/static/stylus/main.styl',
        ])
        .pipe(stylus({
            'include css': true,
        }))
        .pipe(autoprefixer(['last 2 version']))
        .pipe(csso())
        .pipe(gulp.dest('dev/static/css'))
        .pipe(browserSync.stream());
});

// Работа с Pug --------------------------------------------------------------------

gulp.task('pug', function() {
    return gulp.src('dev/pug/pages/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dev'));
});

gulp.task('pugMin', function() {
    return gulp.src('dev/pug/pages/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('dev'));
});

// Запуск сервера --------------------------------------------------------------------

gulp.task('serve', ['stylus', 'pug'], function() {
    browserSync.init({
        server: "./dev",
        notify: false
    });
});

gulp.task('serveMin', ['stylusMin', 'pugMin'], function() {
    browserSync.init({
        server: "./dev",
        notify: false
    });
});

gulp.task('serveHtml', ['stylus'], function() {
    browserSync.init({
        server: "./dev",
        notify: false
    });
});

gulp.task('serveHtmlCss', function() {
    browserSync.init({
        server: "./dev",
        notify: false
    });
});

// Работа с JavaScript --------------------------------------------------------------------

gulp.task('scripts', function() {
    return gulp.src([
            'dev/static/libs/magnific-popup/jquery.magnific-popup.min.js',
            'dev/static/libs/slick/slick.min.js'
            // 'dev/static/libs/datepicker/datepicker.min.js'
            // 'dev/static/libs/lazyload/lazyload.min.js'
            // 'dev/static/libs/parallax/parallax.min.js'
            // 'dev/static/libs/rellax/rellax.min.js'
            // 'dev/static/libs/parallax-scroll/parallax.min.js' 
            // 'dev/static/libs/vide/jquery.vide.min.js' 
            // 'dev/static/libs/bootstrap/bootstrap.js' 
            // 'dev/static/libs/wow/wow.js' 
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dev/static/js'));
});

// Отчитска папки сборки --------------------------------------------------------------------

gulp.task('clean', function() {
    return del.sync('dist');
});

// Слежение за файлами --------------------------------------------------------------------

gulp.task('watch', ['serve', 'scripts'], function() {
    gulp.watch('dev/static/stylus/**/*.styl', ['stylus']);
    gulp.watch('dev/pug/**/*.pug', ['pug']);
    gulp.watch("dev/*.html").on('change', browserSync.reload);
    gulp.watch(['dev/static/js/main.js', '!dev/static/js/libs.min.js', '!dev/static/js/jquery.js'], ['scripts']);
    gulp.watch("dev/static/js/main.js").on('change', browserSync.reload);
});

gulp.task('watchHtml', ['serveHtml', 'scripts'], function() {
    gulp.watch('dev/static/stylus/**/*.styl', ['stylus']);
    // gulp.watch('dev/pug/**/*.pug', ['pug']);
    gulp.watch("dev/*.html").on('change', browserSync.reload);
    gulp.watch(['dev/static/js/main.js', '!dev/static/js/libs.min.js', '!dev/static/js/jquery.js'], ['scripts']);
    gulp.watch("dev/static/js/main.js").on('change', browserSync.reload);
});

gulp.task('watchMin', ['serveMin', 'scripts'], function() {
    gulp.watch('dev/static/stylus/**/*.styl', ['stylusMin']);
    gulp.watch('dev/pug/**/*.pug', ['pugMin']);
    gulp.watch("dev/*.html").on('change', browserSync.reload);
    gulp.watch(['dev/static/js/main.js', '!dev/static/js/libs.min.js', '!dev/static/js/jquery.js'], ['scripts']);
    gulp.watch("dev/static/js/main.js").on('change', browserSync.reload);
});

// Оптимизация изображений --------------------------------------------------------------------

gulp.task('img', function() {
    return gulp.src('dev/static/img/**/*')
        .pipe(cache(imagemin({
            progressive: true,

        })))
        .pipe(gulp.dest('dist/static/img'));
});

// Сборка проэкта DIST --------------------------------------------------------------------

gulp.task('build', ['clean', 'img', 'stylusMin', 'pugMin', 'scripts'], function() {

    var buildCss = gulp.src('dev/static/css/*.css')
        .pipe(gulp.dest('dist/static/css'));

    var buildFonts = gulp.src('dev/static/fonts/**/*')
        .pipe(gulp.dest('dist/static/fonts'));

    var buildJs = gulp.src('dev/static/js/**.js')
        .pipe(gulp.dest('dist/static/js'));

    var buildHtml = gulp.src('dev/*.html')
        .pipe(gulp.dest('dist/'));

});

gulp.task('buildHtml', ['clean', 'img', 'stylusMin', 'scripts'], function() {

    var buildCss = gulp.src('dev/static/css/*.css')
        .pipe(gulp.dest('dist/static/css'));

    var buildFonts = gulp.src('dev/static/fonts/**/*')
        .pipe(gulp.dest('dist/static/fonts'));

    var buildJs = gulp.src('dev/static/js/**.js')
        .pipe(gulp.dest('dist/static/js'));

    var buildHtml = gulp.src('dev/*.html')
        .pipe(gulp.dest('dist/'));

});

// Отчистка кеша --------------------------------------------------------------------

gulp.task('clear', function() {
    return cache.clearAll();
});

// Дефолтный таск --------------------------------------------------------------------

gulp.task('default', ['watch']);

gulp.task('min', ['watchMin']);

gulp.task('html', ['watchHtml']);
