/*
 * hello-project
 *
 * https://github.com/jostw/hello-project
 *
 * Copyright (c) 2014 jos
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {
    var fs =  require("fs"),
        app = require("./project.json").app;

    app.folder.bower = JSON.parse(fs.readFileSync(app.config.bower, "utf8")).directory;

    grunt.initConfig({
        pkg: grunt.file.readJSON(app.config.grunt),

// ##      ##    ###    ########  ######  ##     ##
// ##  ##  ##   ## ##      ##    ##    ## ##     ##
// ##  ##  ##  ##   ##     ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##       #########
// ##  ##  ## #########    ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##    ## ##     ##
//  ###  ###  ##     ##    ##     ######  ##     ##

        watch: {
            options: app.config.watch,

            html: {
                files: app.file.index,

                tasks: ["html"]
            },

            css: {
                files: [
                    app.folder.scss +"/**/*.scss"
                ],

                tasks: ["css"]
            },

            js: {
                files: [
                    app.folder.jsx +"/**/*.jsx",
                    app.folder.js +"/**/*.js",
                    "!"+ app.folder.js +"/"+ app.file.js,
                    "!"+ app.folder.js +"/"+ app.folder.vendor +"/*.js"
                ],

                tasks: ["js"]
            }
        },

//  ######   #######  ########  ##    ##
// ##    ## ##     ## ##     ##  ##  ##
// ##       ##     ## ##     ##   ####
// ##       ##     ## ########     ##
// ##       ##     ## ##           ##
// ##    ## ##     ## ##           ##
//  ######   #######  ##           ##

        copy: {
            vendor: {
                files: (function() {
                    var _files = [],
                        _vendor = app.vendor,
                        _length = _vendor.length;

                    for(var i = 0; i < _length; i++) {
                        _files.push({
                            src: app.folder.bower +"/"+ _vendor[i].folder +"/"+ _vendor[i].file,
                            dest: app.folder.js +"/"+ app.folder.vendor +"/"+ _vendor[i].file
                        });
                    }

                    return _files;
                })()
            },

            bower: {
                src: [
                    app.folder.bower +"/**/*.{css,js}",
                    "!"+ app.folder.bower +"/{"+ app.exclude.join(",") +"}/**/*.{css,js}"
                ],

                dest: app.folder.dist +"/"
            },

            css: {
                src: app.folder.css +"/"+ app.file.css,
                dest: app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css
            },

            js: {
                files: [
                    {
                        src: app.folder.js +"/"+ app.file.js,
                        dest: app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js
                    }, {
                        src: app.folder.js +"/"+ app.folder.vendor +"/*.js",
                        dest: app.folder.dist +"/"
                    }
                ]
            }
        },

//  ######  ##       ########    ###    ##    ##
// ##    ## ##       ##         ## ##   ###   ##
// ##       ##       ##        ##   ##  ####  ##
// ##       ##       ######   ##     ## ## ## ##
// ##       ##       ##       ######### ##  ####
// ##    ## ##       ##       ##     ## ##   ###
//  ######  ######## ######## ##     ## ##    ##

        clean: {
            options: app.config.clean,

            dist: {
                src: [
                    app.folder.dist +"/"+ app.file.index,
                    app.folder.dist +"/"+ app.folder.bower,
                    app.folder.dist +"/"+ app.folder.css,
                    app.folder.dist +"/"+ app.folder.js
                ]
            },

            temp: {
                src: app.folder.temp
            },

            bower: {
                src: app.folder.dist +"/"+ app.folder.bower
            }
        },

// ########  ######## ##     ##
// ##     ## ##       ##     ##
// ##     ## ##       ##     ##
// ########  ######   ##     ##
// ##   ##   ##        ##   ##
// ##    ##  ##         ## ##
// ##     ## ########    ###

        rev: {
            options: app.config.rev,

            dist: {
                src: [
                    app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css,
                    app.folder.dist +"/"+ app.folder.js  +"/"+ app.file.js
                ]
            }
        },

// ##     ##  ######  ######## ##     ## #### ##    ##
// ##     ## ##    ## ##       ###   ###  ##  ###   ##
// ##     ## ##       ##       #### ####  ##  ####  ##
// ##     ##  ######  ######   ## ### ##  ##  ## ## ##
// ##     ##       ## ##       ##     ##  ##  ##  ####
// ##     ## ##    ## ##       ##     ##  ##  ##   ###
//  #######   ######  ######## ##     ## #### ##    ##

        useminPrepare: {
            options: {
                dest: app.folder.dist
            },

            html: app.folder.dist +"/"+ app.file.index
        },

        usemin: {
            options: {
                assetsDirs: app.folder.dist
            },

            html: app.folder.dist +"/"+ app.file.index
        },

// ##     ## ######## ##     ## ##
// ##     ##    ##    ###   ### ##
// ##     ##    ##    #### #### ##
// #########    ##    ## ### ## ##
// ##     ##    ##    ##     ## ##
// ##     ##    ##    ##     ## ##
// ##     ##    ##    ##     ## ########

        wiredep: {
            dev: {
                src: app.file.index,
                exclude: app.exclude
            }
        },

        htmlhint: {
            options: {
                htmlhintrc: app.config.htmlhint
            },

            dev: {
                src: app.file.index
            }
        },

        htmlmin: {
            dev: {
                src: app.file.index,
                dest: app.folder.dist +"/"+ app.file.index
            },

            dist: {
                options: app.config.htmlmin,

                src: app.folder.dist  +"/"+ app.file.index,
                dest: app.folder.dist +"/"+ app.file.index
            }
        },

//  ######   ######   ######
// ##    ## ##    ## ##    ##
// ##       ##       ##
// ##        ######   ######
// ##             ##       ##
// ##    ## ##    ## ##    ##
//  ######   ######   ######

        sass: {
            dev: {
                files: {
                    "css/style.css": "scss/style.scss"
                }
            }
        },

        autoprefixer: {
            dev: {
                src: app.folder.dist +"/"+ app.folder.css +"/**/*.css"
            }
        },

        csslint: {
            options: {
                csslintrc: app.config.csslint
            },

            dev: {
                src: app.folder.css +"/"+ app.file.css
            }
        },

//       ##  ######
//       ## ##    ##
//       ## ##
//       ##  ######
// ##    ##       ##
// ##    ## ##    ##
//  ######   ######

        jshint: {
            options: {
                jshintrc: app.config.jshint,
                reporter: require("jshint-stylish")
            },

            grunt: {
                src: app.file.grunt
            },

            dev: {
                src: [
                    app.folder.js +"/**/*.js",
                    "!"+ app.folder.js +"/"+ app.file.js,
                    "!"+ app.folder.js +"/"+ app.folder.vendor +"/*.js"
                ]
            }
        },

        browserify: {
            dev: {
                src: [
                    app.folder.js +"/**/*.js",
                    "!"+ app.folder.js +"/"+ app.file.js,
                    "!"+ app.folder.js +"/"+ app.folder.vendor +"/*.js"
                ],

                dest: app.folder.js +"/"+ app.file.js
            }
        },

        uglify: {
            options: app.config.uglify,

            modernizr: {
                src: app.folder.bower +"/modernizr/modernizr.js",
                dest: app.folder.js +"/"+ app.folder.vendor +"/modernizr.min.js"
            }
        }
    });

// ########    ###     ######  ##    ##  ######
//    ##      ## ##   ##    ## ##   ##  ##    ##
//    ##     ##   ##  ##       ##  ##   ##
//    ##    ##     ##  ######  #####     ######
//    ##    #########       ## ##  ##         ##
//    ##    ##     ## ##    ## ##   ##  ##    ##
//    ##    ##     ##  ######  ##    ##  ######

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("reset", [
        "jshint:grunt",

        "clean:dist",
        "uglify:modernizr",
        "copy:vendor"
    ]);

    grunt.registerTask("html", [
        "wiredep:dev",
        "htmlhint:dev",
        "htmlmin:dev"
    ]);

    grunt.registerTask("css", [
        "sass:dev",
        "csslint:dev",
        "copy:css",
        "autoprefixer:dev"
    ]);

    grunt.registerTask("js", [
        "jshint:dev",
        "browserify:dev",
        "copy:js"
    ]);

    grunt.registerTask("init", [
        "reset",
        "copy:bower",

        "html",
        "css",
        "js"
    ]);

    grunt.registerTask("set", [
        "reset",

        "wiredep:dev",

        "jshint:dev",
        "react:dev",
        "browserify:dev"
    ]);

    grunt.registerTask("default", [
        "init",
        "watch"
    ]);

    grunt.registerTask("build", [
        "init",

        "useminPrepare",

        "concat:generated",
        "cssmin:generated",
        "uglify:generated",

        "rev:dist",
        "usemin",

        "htmlmin:dist",
        "clean:temp",

        "clean:bower"
    ]);
};
