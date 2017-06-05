/* Loading gulp packages */
var gulp = require('gulp-param')(require('gulp'), process.argv);
var run = require('gulp-run');
var plugins = require('gulp-load-plugins')();

/* Gobal variables used for gulp build */
var paths = {

    js: ['./src/**/**/*.js'],
    css: ['./src/css/**/*.css'],
    vendorjs: [
        "./bower_components/jquery/dist/jquery.min.js",
        "./bower_components/bootstrap/dist/js/bootstrap.min.js",
        "./bower_components/angular/angular.min.js",
        "./bower_components/angular-animate/angular-animate.min.js",
        "./bower_components/AngularJS-Toaster/toaster.min.js",
        "./bower_components/angular-ui-router/release/angular-ui-router.min.js",
    ],
    vendorcss: ["./bower_components/AngularJS-Toaster/toaster.min.css",
        "./bower_components/bootstrap/dist/css/bootstrap.min.css"
    ],
    fonts: ["./bower_components/bootstrap/dist/**/*.ttf", "./bower_components/bootstrap/dist/**/*.woff",
        './bower_components/bootstrap/dist/**/*.woff2', './bower_components/bootstrap/dist/**/*.svg'
    ],
    staticfiles: ['./src/index.html'],
    img: ['./src/img/**/*.png', './src/img/**/*.jpg', './src/img/**/*.jpeg'],
    templates: ['./src/templates/**/*.html']
};



/* whatch our code for modification */
gulp.task('watch', function() {

    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.templates, ['copyTemplates']);
    gulp.watch(paths.staticfiles, ['copyTemplates']);

});


/**  LOAD all gulp tasks from tasks/ directory */
/* we do split all tasks with different files to keep it clear */
var taskPath = './tasks/';
var taskList = require('fs').readdirSync(taskPath);

taskList.forEach(function(taskFile) {
    // or .call(gulp,...) to run this.task('foobar')...
    require(taskPath + taskFile)(gulp, plugins, paths);
});