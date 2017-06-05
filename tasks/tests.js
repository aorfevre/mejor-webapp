module.exports = function(gulp, $) {
    'use strict';


    var connect = require('gulp-connect');
    
    /* creates a webapp server */
    gulp.task('connect', function() {
        connect.server({
            root: './www/',
            port: "8080",
            livereload: true
        });
    });




};