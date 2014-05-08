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
    respond: new RegExp(app.regex.respond),

    index: new RegExp(app.regex.index)
};


// ##      ##    ###    ########  ######  ##     ##
// ##  ##  ##   ## ##      ##    ##    ## ##     ##
// ##  ##  ##  ##   ##     ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##       #########
// ##  ##  ## #########    ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##    ## ##     ##
//  ###  ###  ##     ##    ##     ######  ##     ##

gulp.task("watch", ["slim:dev", "rename:partial", "concat:main", "htmlmin:dev", "clean:partial"], function() {
    var livereload = plugins.livereload();

    gulp.watch(app.folder.scss +"/**/*.scss", function() {
        setTimeout(function() {
            gulp.start(
                // css-init
                "compass:dev",
                "clean:css",

                // css-lint
                "csslint:dist"
            );
        }, 500);
    });

    gulp.watch(app.folder.stylus +"/**/*.styl", function() {
        setTimeout(function() {
            gulp.start(
                // css-init
                "stylus:dev",
                "autoprefixer:dist",

                // css-lint
                "csslint:dist"
            );
        }, 500);
    });

    gulp.watch(app.folder.js +"/**/*.js", function() {
        setTimeout(function() {
            gulp.start(
                // js-init
                "copy:js",
                "clean:js",

                // js-lint
                "jshint:js"
            );
        }, 500);
    });

    gulp.watch(["*.slim", app.folder.template +"/*.slim"], function() {
        setTimeout(function() {
            gulp.start(
                // html-init
                "slim:dev",
                "rename:partial",
                "concat:main",
                "htmlmin:dev", "clean:partial",

                // html-lint
                "htmlhint:dist"
            );
        }, 500);
    });

    gulp.watch([app.folder.dist +"/**"]).on("change", function(file) {
        livereload.changed(file.path);
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
               ])
               .pipe(plugins.clean(app.config.clean));
});

gulp.task("clean:css", ["compass:dev"], function() {
    return gulp.src(app.folder.css)
               .pipe(plugins.clean(app.config.clean));
});

gulp.task("clean:js", ["copy:js"], function() {
    gulp.src(app.folder.js +"/"+ app.folder.vendor)
        .pipe(plugins.clean(app.config.clean));
});

gulp.task("clean:partial", ["concat:main"], function() {
    gulp.src(app.folder.partial)
        .pipe(plugins.clean(app.config.clean));
});

gulp.task("clean:vendor", function() {
    gulp.src(app.folder.dist +"/"+ app.folder.vendor)
        .pipe(plugins.clean(app.config.clean));
});

gulp.task("clean:usemin", function() {
    gulp.src([
        app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css,
        app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js,
    ])
    .pipe(plugins.clean(app.config.clean));
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

gulp.task("csslint:dist", preprocessor === "compass" ? ["compass:dev"] : ["stylus:dev", "autoprefixer:dist"], function() {
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
 */
gulp.task("html-init", function() {
    gulp.start(
        "slim:dev",
        "rename:partial",
        "concat:main",
        "htmlmin:dev", "clean:partial"
    );
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
    else {
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

/**
 * Usemin replace:
 *     - Concat assests files into a single file
 *     - Replace assests files to single file
 *     - Revision files name
 *     - Remove redudant code in the html file
 *     - Lint html file
 */
gulp.task("usemin-replace", ["concat:main"], function() {
    return gulp.src(app.folder.dist +"/"+ app.file.index)
               .pipe(plugins.useref.assets())
               .pipe(plugins.useref.restore())
               .pipe(plugins.useref())
               .pipe(gulp.dest(app.folder.dist))

               .pipe(plugins.revAll({
                   ignore: [
                       app.regex.html5shiv,
                       app.regex.respond,
                       app.regex.index
                   ]
               }))
               .pipe(gulp.dest(app.folder.dist))

               .pipe(plugins.filter(app.file.index))

               .pipe(plugins.htmlmin())
               .pipe(gulp.dest(app.folder.dist))

               .pipe(plugins.htmlhint({ htmlhintrc: app.config.htmlhint }))
               .pipe(plugins.htmlhint.reporter());
});

/**
 * Usemin remove:
 *     - Remove vendor folder in distribution folder
 *     - Remove unrevision files in distribution folder
 */
gulp.task("usemin-remove", ["usemin-replace"], function() {
    gulp.start("clean:vendor", "clean:usemin");
});

// ########    ###     ######  ##    ##  ######
//    ##      ## ##   ##    ## ##   ##  ##    ##
//    ##     ##   ##  ##       ##  ##   ##
//    ##    ##     ##  ######  #####     ######
//    ##    #########       ## ##  ##         ##
//    ##    ##     ## ##    ## ##   ##  ##    ##
//    ##    ##     ##  ######  ##    ##  ######

/**
 * Default task:
 *     - Lint Gruntfile.js
 *     - html-init task
 *     - Watch files
 *
 *     * Add livereload.js to html
 */
gulp.task("default", ["jshint:gulp"], function() {
    isWatch = true;

    gulp.start(
        // html-init
        "slim:dev",
        "rename:partial",
        "concat:main",
        "htmlmin:dev", "clean:partial",

        "watch"
    );
});

/**
 * Clear task:
 *     - Remove all generated files
 *     - Insert bower files into slim templates
 */
gulp.task("clear", ["clean:all"], function() {
    return gulp.start("bowerInstall:dev");
});

/**
 * Reset task:
 *     - Lint Gruntfile.js
 *     - Clear task
 *
 *     - Copy vendor files to distribution folder
 *
 *     - Create css file
 *     - Lint css file
 *
 *     - Create js file
 *     - Lint js file
 *
 *     - Creat html file
 *     - Lint html file
 */
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

/**
 * Build task:
 *     - Lint Gruntfile.js
 *     - Clear task
 *
 *     - Copy vendor files to distribution folder
 *
 *     - Create css file
 *     - Lint css file
 *
 *     - Create js file
 *     - Lint js file
 *
 *     - Creat html file
 *
 *     - Usemin replace
 *     - Usemin remove
 */
gulp.task("build", ["jshint:gulp", "clear"], function() {
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
        "clean:partial",

        // usemin
        "usemin-replace",
        "usemin-remove"
    );
});
