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

//  ######  ##       ########    ###    ##    ##
// ##    ## ##       ##         ## ##   ###   ##
// ##       ##       ##        ##   ##  ####  ##
// ##       ##       ######   ##     ## ## ## ##
// ##       ##       ##       ######### ##  ####
// ##    ## ##       ##       ##     ## ##   ###
//  ######  ######## ######## ##     ## ##    ##

gulp.task("clean:partial", ["concat:main"], function() {
    gulp.src(app.folder.partial, { read: false })
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

//       ##  ######
//       ## ##    ##
//       ## ##
//       ##  ######
// ##    ##       ##
// ##    ## ##    ##
//  ######   ######

gulp.task("jshint:gulp", function() {
    return gulp.src(app.file.gulp)
               .pipe(plugins.jshint(".jshintrc"))
               .pipe(plugins.jshint.reporter("jshint-stylish"));
});

//  ######  ##     ## ########  ########    ###     ######  ##    ##  ######
// ##    ## ##     ## ##     ##    ##      ## ##   ##    ## ##   ##  ##    ##
// ##       ##     ## ##     ##    ##     ##   ##  ##       ##  ##   ##
//  ######  ##     ## ########     ##    ##     ##  ######  #####     ######
//       ## ##     ## ##     ##    ##    #########       ## ##  ##         ##
// ##    ## ##     ## ##     ##    ##    ##     ## ##    ## ##   ##  ##    ##
//  ######   #######  ########     ##    ##     ##  ######  ##    ##  ######

gulp.task("html-init", function() {
    gulp.start(
        "slim:dev",
        "rename:partial",
        "concat:main",
        "htmlmin:dev", "clean:partial"
    );
});

gulp.task("html-lint", function() {
    gulp.start("htmlhint:dist");
});

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
