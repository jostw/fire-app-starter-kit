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

    app = require("./project.json").app;

gulp.task("watch", function() {
    var server = plugins.livereload();

    gulp.watch([app.folder.dist +"/**"]).on("change", function(file) {
        server.changed(file.path);
    });
});

gulp.task("jshint:gulp", function() {
    return gulp.src(app.file.gulp)
               .pipe(plugins.jshint(".jshintrc"))
               .pipe(plugins.jshint.reporter("jshint-stylish"));
});

gulp.task("default", ["jshint:gulp"], function() {
    gulp.start("watch");
});
