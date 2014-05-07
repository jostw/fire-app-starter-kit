/*
 * hello-project
 *
 * https://github.com/jostw/hello-project
 *
 * Copyright (c) 2014 jos
 * Licensed under the MIT license.
 */

"use strict";

var gulp =    require("gulp"),

    fs =      require("fs"),
    wiredep = require("wiredep").stream,
    yargs =   require("yargs"),

    plugins = require("gulp-load-plugins")(),

    app =     require("./project.json").app,

    /**
     * Usage: gulp [task] [--pre=stylus]
     *     - Use compass as default preprocessor
     */
    preprocessor = yargs.argv.pre || app.preprocessor,

    isWatch = false;


app.folder.vendor = JSON.parse(fs.readFileSync(app.config.bower, "utf8")).directory;

app.regex = {
    html5shiv: new RegExp(app.regex.html5shiv),
    respond: new RegExp(app.regex.respond)
};


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
    var count = 0,
        src = [
            app.folder.partial +"/"+ app.file.head,
            app.folder.partial +"/"+ app.file.style,

            app.folder.partial +"/"+ app.file.main,

            app.folder.partial +"/"+ app.file.foot,
            app.folder.partial +"/"+ app.file.script
        ];

    /**
     *     * Add livereload.js to html when using html-watch task
     */
    if(isWatch) {
        src.push(app.folder.partial +"/"+ app.file.livereload);
    }

    return gulp.src(src)
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

gulp.task("copy:vendor", function() {
    gulp.src([
            app.folder.vendor +"/**/*.css",
            app.folder.vendor +"/**/*.js"
        ])
        .pipe(gulp.dest(app.folder.dist +"/"+ app.folder.vendor));

    return gulp.src([
                   app.folder.vendor +"/"+ app.vendor.html5shiv.path +"/"+ app.vendor.html5shiv.file,
                   app.folder.vendor +"/"+ app.vendor.respond.path +"/"+ app.vendor.respond.file
               ])
               .pipe(gulp.dest(app.folder.js +"/"+ app.folder.vendor));
});

gulp.task("copy:js", ["copy:vendor"], function() {
    return gulp.src(app.folder.js +"/**/*.js")
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
    return gulp.src([
                   app.folder.css,
                   app.folder.js +"/"+ app.folder.vendor,
                   app.folder.partial,
                   app.folder.temp,
                   app.folder.dist
               ], app.config.clean)
               .pipe(plugins.clean());
});

gulp.task("clean:css", [preprocessor +":dev"], function() {
    return gulp.src(app.folder.css, app.config.clean)
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

gulp.task("bowerInstall:dev", function() {
    return gulp.src([
                   app.template.style,
                   app.template.script
               ])
               .pipe(wiredep({
                   directory: app.folder.vendor,
                   exclude: [
                       app.regex.html5shiv,
                       app.regex.respond
                   ]
               }))
               .pipe(gulp.dest("."));
});

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
    return gulp.src(app.folder.dist +"/"+ app.file.index)
               .pipe(plugins.htmlmin())
               .pipe(gulp.dest(app.folder.dist));
});

gulp.task("htmlhint:dist", ["htmlmin:dev"], function() {
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

gulp.task("stylus:dev", function() {
    return gulp.src(app.folder.stylus +"/**/*.styl")
               .pipe(plugins.stylus(app.config.stylus))
               .pipe(gulp.dest(app.folder.dist +"/"+ app.folder.css));
});

gulp.task("autoprefixer:dist", ["stylus:dev"], function() {
    return gulp.src(app.folder.dist +"/"+ app.folder.css +"/**/*.css")
               .pipe(plugins.autoprefixer())
               .pipe(gulp.dest(app.folder.dist +"/"+ app.folder.css));
});

gulp.task("csslint:dist", preprocessor === "compass" ? [preprocessor +":dev"] : ["stylus:dev", "autoprefixer:dist"], function() {
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

gulp.task("jshint:js", ["copy:js"], function() {
    gulp.src(app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js)
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

/**
 * Create html file:
 *     - Create partial html files from slim templates
 *     - Rename partial html files
 *     - Concat partial html files into a single html file
 *     - Remove redudant code in the html file
 *     - Remove partial html files
 *
 *     * Add livereload.js to html when using html-watch task
 */
gulp.task("html-init", function() {
    gulp.start(
        "slim:dev",
        "rename:partial",
        "concat:main",
        "htmlmin:dev", "clean:partial"
    );
});

gulp.task("html-watch", function() {
    isWatch = true;

    gulp.start("html-init");
});

/**
 * Lint html file:
 *     - Validate the html file
 */
gulp.task("html-lint", function() {
    gulp.start("htmlhint:dist");
});

/**
 * Create css file:
 *     - Create a css file from scss/stylus files
 *
 *     * Remove the original css file when using compass
 *     * Add vendor prefix with autoprefixer when using stylus
 */
gulp.task("css-init", function() {
    if(preprocessor === "compass") {
        gulp.start(
            "compass:dev",
            "clean:css"
        );
    }
    else if(preprocessor === "stylus") {
        gulp.start(
            "stylus:dev",
            "autoprefixer:dist"
        );
    }
});

/**
 * Lint css file:
 *     - Lint css file in distribution folder
 */
gulp.task("css-lint", function() {
    gulp.start("csslint:dist");
});

/**
 * Create js file:
 *     - Copy js file to distribution folder
 *     - Remove vendor folder in js folder
 */
gulp.task("js-init", function() {
    gulp.start(
        "copy:js",
        "clean:js"
    );
});

/**
 * Lint js file:
 *     - Lint js file in distribution folder
 */
gulp.task("js-lint", function() {
    gulp.start("jshint:js");
});

// ########    ###     ######  ##    ##  ######
//    ##      ## ##   ##    ## ##   ##  ##    ##
//    ##     ##   ##  ##       ##  ##   ##
//    ##    ##     ##  ######  #####     ######
//    ##    #########       ## ##  ##         ##
//    ##    ##     ## ##    ## ##   ##  ##    ##
//    ##    ##     ##  ######  ##    ##  ######

gulp.task("default", ["jshint:gulp", "html-watch"], function() {
    gulp.start("watch");
});


gulp.task("clear", ["clean:all"], function() {
    return gulp.start("bowerInstall:dev");
});


gulp.task("reset", ["jshint:gulp", "clear"], function() {
    gulp.start(
        "copy:vendor",

        // css-init
        preprocessor +":dev",
        preprocessor === "compass" ? "clean:css" : "autoprefixer:dist",

        // css-lint
        "csslint:dist",

        // js-init
        "copy:js",
        "clean:js",

        // js-lint
        "jshint:js",

        // html-init
        "slim:dev",
        "rename:partial",
        "concat:main",
        "htmlmin:dev", "clean:partial",

        // html-lint
        "htmlhint:dist"
    );
});
