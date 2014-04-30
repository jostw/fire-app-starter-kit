/*
 * hello-project
 *
 * https://github.com/jostw/hello-project
 *
 * Copyright (c) 2014 jos
 * Licensed under the MIT license.
 */

"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    app = {
        file: {
            gulp: "gulpfile.js"
        }
    };

gulp.task("default", function() {

});

gulp.task("jshint:gulp", function() {
    return gulp.src(app.file.gulp)
               .pipe(plugins.jshint(".jshintrc"))
               .pipe(plugins.jshint.reporter("jshint-stylish"));
});
