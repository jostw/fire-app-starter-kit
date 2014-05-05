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
    yargs = require("yargs"),

    plugins = require("gulp-load-plugins")(),

    app = require("./project.json").app;

// ##      ##    ###    ########  ######  ##     ##
// ##  ##  ##   ## ##      ##    ##    ## ##     ##
// ##  ##  ##  ##   ##     ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##       #########
// ##  ##  ## #########    ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##    ## ##     ##
//  ###  ###  ##     ##    ##     ######  ##     ##

gulp.task("watch", function() {
    var server = plugins.livereload();

    gulp.watch([app.folder.dist +"/**"]).on("change", function(file) {
        server.changed(file.path);
    });
});

// ########  ######## ##    ##    ###    ##     ## ########
// ##     ## ##       ###   ##   ## ##   ###   ### ##
// ##     ## ##       ####  ##  ##   ##  #### #### ##
// ########  ######   ## ## ## ##     ## ## ### ## ######
// ##   ##   ##       ##  #### ######### ##     ## ##
// ##    ##  ##       ##   ### ##     ## ##     ## ##
// ##     ## ######## ##    ## ##     ## ##     ## ########

gulp.task("rename:partial", ["slim:dev"], function() {
    return gulp.src(app.folder.partial +"/*.html")
               .pipe(plugins.rename(function(path) {
                   path.basename = path.basename.match(/_(.+).html/)[1];
               }))
               .pipe(gulp.dest(app.folder.partial));
});

//  ######   #######  ##    ##  ######     ###    ########
// ##    ## ##     ## ###   ## ##    ##   ## ##      ##
// ##       ##     ## ####  ## ##        ##   ##     ##
// ##       ##     ## ## ## ## ##       ##     ##    ##
// ##       ##     ## ##  #### ##       #########    ##
// ##    ## ##     ## ##   ### ##    ## ##     ##    ##
//  ######   #######  ##    ##  ######  ##     ##    ##

gulp.task("concat:main", ["rename:partial"], function() {
    var count = 0;

    return gulp.src([
                   app.folder.partial +"/"+ app.file.head,
                   app.folder.partial +"/"+ app.file.style,

                   app.folder.partial +"/"+ app.file.main,

                   app.folder.partial +"/"+ app.file.foot,
                   app.folder.partial +"/"+ app.file.script
               ])
               .pipe(plugins.concatUtil(app.file.index, {
                   process: function(src) {
                       if(count === 2) {
                           src = "</head>\n<body>\n"+ src;
                       }

                       count++;

                       return src;
                   }
               }))
               .pipe(plugins.concatUtil.header("<!DOCTYPE html>\n<html lang=\"zh-TW\">\n<head>\n"))
               .pipe(plugins.concatUtil.footer("</body>\n</html>\n"))
               .pipe(gulp.dest(app.folder.dist));
});

//  ######   #######  ########  ##    ##
// ##    ## ##     ## ##     ##  ##  ##
// ##       ##     ## ##     ##   ####
// ##       ##     ## ########     ##
// ##       ##     ## ##           ##
// ##    ## ##     ## ##           ##
//  ######   #######  ##           ##

gulp.task("copy:js", function() {
    gulp.src(app.folder.js +"/**/*.js")
        .pipe(gulp.dest(app.folder.dist +"/"+ app.folder.js));
});

//  ######  ##       ########    ###    ##    ##
// ##    ## ##       ##         ## ##   ###   ##
// ##       ##       ##        ##   ##  ####  ##
// ##       ##       ######   ##     ## ## ## ##
// ##       ##       ##       ######### ##  ####
// ##    ## ##       ##       ##     ## ##   ###
//  ######  ######## ######## ##     ## ##    ##

gulp.task("clean:all", function() {
    gulp.src([
            app.folder.css,
            app.folder.js +"/"+ app.folder.vendor,
            app.folder.partial,
            app.folder.temp,
            app.folder.dist
        ], app.config.clean)
        .pipe(plugins.clean());
});

gulp.task("clean:css", ["compass:dev"], function() {
    gulp.src(app.folder.css, app.config.clean)
        .pipe(plugins.clean());
});

gulp.task("clean:js", ["copy:js"], function() {
    gulp.src(app.folder.js +"/"+ app.folder.vendor, app.config.clean)
        .pipe(plugins.clean());
});

gulp.task("clean:partial", ["concat:main"], function() {
    gulp.src(app.folder.partial, app.config.clean)
        .pipe(plugins.clean());
});

// ##     ## ######## ##     ## ##
// ##     ##    ##    ###   ### ##
// ##     ##    ##    #### #### ##
// #########    ##    ## ### ## ##
// ##     ##    ##    ##     ## ##
// ##     ##    ##    ##     ## ##
// ##     ##    ##    ##     ## ########

gulp.task("slim:dev", function() {
    return gulp.src([
                   app.template.style,
                   app.template.script,

                   app.folder.template +"/"+ app.template.head,
                   app.folder.template +"/"+ app.template.main,
                   app.folder.template +"/"+ app.template.foot,

                   app.folder.template +"/"+ app.template.livereload
               ])
               .pipe(plugins.slim(app.config.slim))
               .pipe(gulp.dest(app.folder.partial));
});

gulp.task("htmlmin:dev", ["concat:main"], function() {
    gulp.src(app.folder.dist +"/"+ app.file.index)
        .pipe(plugins.htmlmin())
        .pipe(gulp.dest(app.folder.dist));
});

gulp.task("htmlhint:dist", function() {
    gulp.src(app.folder.dist +"/"+ app.file.index)
        .pipe(plugins.htmlhint({ htmlhintrc: app.config.htmlhint }))
        .pipe(plugins.htmlhint.reporter());
});

//  ######   ######   ######
// ##    ## ##    ## ##    ##
// ##       ##       ##
// ##        ######   ######
// ##             ##       ##
// ##    ## ##    ## ##    ##
//  ######   ######   ######

gulp.task("compass:dev", function() {
    return gulp.src(app.folder.scss +"/**/*.scss")
               .pipe(plugins.compass({
                   config_file: app.config.compass,
                   css: app.folder.css,
                   sass: app.folder.scss
               }))
               .pipe(gulp.dest(app.folder.dist +"/"+ app.folder.css));
});

gulp.task("csslint:dist", function() {
    gulp.src(app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css)
        .pipe(plugins.csslint(app.config.csslint))
        .pipe(plugins.csslint.reporter());
});

//       ##  ######
//       ## ##    ##
//       ## ##
//       ##  ######
// ##    ##       ##
// ##    ## ##    ##
//  ######   ######

gulp.task("jshint:gulp", function() {
    return gulp.src(app.file.gulp)
               .pipe(plugins.jshint(app.config.jshint))
               .pipe(plugins.jshint.reporter("jshint-stylish"));
});

gulp.task("jshint:js", function() {
    return gulp.src(app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js)
               .pipe(plugins.jshint(app.config.jshint))
               .pipe(plugins.jshint.reporter("jshint-stylish"));
});

//  ######  ##     ## ########  ########    ###     ######  ##    ##  ######
// ##    ## ##     ## ##     ##    ##      ## ##   ##    ## ##   ##  ##    ##
// ##       ##     ## ##     ##    ##     ##   ##  ##       ##  ##   ##
//  ######  ##     ## ########     ##    ##     ##  ######  #####     ######
//       ## ##     ## ##     ##    ##    #########       ## ##  ##         ##
// ##    ## ##     ## ##     ##    ##    ##     ## ##    ## ##   ##  ##    ##
//  ######   #######  ########     ##    ##     ##  ######  ##    ##  ######

var preprocessor = yargs.argv.pre || app.preprocessor;

gulp.task("html-init", [
    "slim:dev",
    "rename:partial",
    "concat:main",
    "htmlmin:dev", "clean:partial"
]);

gulp.task("html-lint", ["htmlhint:dist"]);


gulp.task("css-init", [preprocessor +":dev", "clean:css"]);

gulp.task("css-lint", ["csslint:dist"]);


gulp.task("js-init", ["copy:js", "clean:js"]);

gulp.task("js-lint", ["jshint:js"]);

// ########    ###     ######  ##    ##  ######
//    ##      ## ##   ##    ## ##   ##  ##    ##
//    ##     ##   ##  ##       ##  ##   ##
//    ##    ##     ##  ######  #####     ######
//    ##    #########       ## ##  ##         ##
//    ##    ##     ## ##    ## ##   ##  ##    ##
//    ##    ##     ##  ######  ##    ##  ######

gulp.task("default", ["jshint:gulp"], function() {
    gulp.start("watch");
});

gulp.task("clear", ["clean:all"]);
