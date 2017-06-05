module.exports = function(gulp, $, paths) {
    'use strict';


    var install = require("gulp-install");
    var concat = require('gulp-concat');
    var ngAnnotate = require('gulp-ng-annotate');


    /* default task : used for dev 
    a specific task may be created (default-prod) to add minify / uglify / concat (and more) on our SRC files
    */
    gulp.task('default', ['install', 'js', 'css', 'vendors', 'copyFonts','copyTemplates','copyImg'], function() {
        return gulp.src(paths.staticfiles)

        .pipe(gulp.dest('./www/'));

    })

    gulp.task('install', function() {
        return gulp.src(['./bower.json', './package.json']).pipe(install());

    })

    gulp.task('js', function() {
        /* concatenation of all css produced -> all.js */
        /* we do not add minify / uglify as it is a prod feature */
        return gulp.src(paths.js)
            .pipe(concat("all.js"))
            .pipe(gulp.dest('./debug/js/'))
            .pipe(ngAnnotate())
            .pipe(gulp.dest('./www/js/'));

    });

    gulp.task('css', function() {
        /* concatenation of all css produced -> all.css */
        /* we do not add minify as it is a prod feature */
        return gulp.src(paths.css)
            .pipe(concat("all.css"))
            .pipe(gulp.dest('./www/css/'));

    });

    gulp.task('vendors', ['vendorcss'], function() {
        /* concatenation of all js produced -> all.js */
        /* we do not add minify as it is a prod feature */
        return gulp.src(paths.vendorjs)
            .pipe(concat("vendors.js"))
            .pipe(gulp.dest('./www/js/'));

    })

    gulp.task('vendorcss', function() {
        /* concatenation of all css produced -> all.css */
        /* we do not add minify as it is a prod feature */
        return gulp.src(paths.vendorcss)
            .pipe(concat("vendors.css"))
            .pipe(gulp.dest('./www/css/'));

    });


    gulp.task('copyFonts', function() {
        return gulp.src(paths.fonts)
            .pipe(gulp.dest('./www'));
    });
    gulp.task('copyTemplates', function() {
        return gulp.src(paths.templates)
            .pipe(gulp.dest('./www/templates'));
    });
    gulp.task('copyImg', function() {
        return gulp.src(paths.img)
            .pipe(gulp.dest('./www/img'));
    });

};