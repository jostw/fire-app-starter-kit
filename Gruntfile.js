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
    var config = {
        dist: "dist",

        vendor: [
            {
                folder: "html5shiv/dist",
                file: "html5shiv.min.js"
            }, {
                folder: "respond/dest",
                file: "respond.min.js"
            }, {
                folder: "jquery/dist",
                file: "jquery.min.js"
            }
        ],

        exclude: [
            "html5shiv",
            "respond",
            "modernizr",
            "jquery"
        ]
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

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
                    var files = [];

                    config.vendor.map(function(vendor) {
                        files.push({
                            src: "bower_components/"+ vendor.folder +"/"+ vendor.file,
                            dest: "js/vendor/"+ vendor.file
                        });
                    });

                    return files;
                })()
            },

            bower: {
                src: [
                    "bower_components/**/*.{css,js}",
                    "!bower_components/{"+ config.exclude.join(",") +"}/**/*.{css,js}"
                ],

                dest: config.dist +"/"
            },

            css: {
                src: "css/style.css",
                dest: config.dist +"/css/style.css"
            },

            js: {
                files: [
                    {
                        src: "js/script/js",
                        dest: config.dist +"/js/script.js"
                    }, {
                        src: "js/vendor/*.js",
                        dest: config.dist +"/"
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
            options: {
                force: true
            },

            dist: {
                src: [
                    config.dist +"/index.html",
                    config.dist +"/bower_components/",
                    config.dist +"/css/",
                    config.dist +"/js/"
                ]
            },

            temp: {
                src: ".tmp/"
            },

            bower: {
                src: config.dist +"/bower_components/"
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
            options: {
                encoding: "utf8",
                algorithm: "md5",
                length: 8
            },

            dist: {
                src: [
                    config.dist +"/css/style.css",
                    config.dist +"/js/script.js"
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
                dest: config.dist
            },

            html: config.dist +"/index.html"
        },

        usemin: {
            options: {
                assetsDirs: config.dist
            },

            html: config.dist +"/index.html"
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
                src: "index.html",
                exclude: config.exclude
            }
        },

        htmlhint: {
            options: {
                htmlhintrc: ".htmlhintrc"
            },

            dev: {
                src: "index.html"
            }
        },

        htmlmin: {
            dev: {
                src: "index.html",
                dest: config.dist +"/index.html"
            },

            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                src: config.dist  +"/index.html",
                dest: config.dist +"/index.html"
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
                src: config.dist +"/css/**/*.css"
            }
        },

        csslint: {
            options: {
                csslintrc: ".csslintrc"
            },

            dev: {
                src: "css/style.css"
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
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },

            grunt: {
                src: "Gruntfile.js"
            },

            dev: {
                src: [
                    "js/**/*.js",
                    "!js/script.js",
                    "!js/vendor/*.js"
                ]
            }
        },

        browserify: {
            dev: {
                src: [
                    "js/**/*.js",
                    "!js/script.js",
                    "!js/vendor/*.js"
                ],

                dest: "js/script.js"
            }
        },

        uglify: {
            options: {
                preserveComments: "some"
            },

            modernizr: {
                src: "bower_components/modernizr/modernizr.js",
                dest: "js/vendor/modernizr.min.js"
            }
        },

// ##      ##    ###    ########  ######  ##     ##
// ##  ##  ##   ## ##      ##    ##    ## ##     ##
// ##  ##  ##  ##   ##     ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##       #########
// ##  ##  ## #########    ##    ##       ##     ##
// ##  ##  ## ##     ##    ##    ##    ## ##     ##
//  ###  ###  ##     ##    ##     ######  ##     ##

        watch: {
            options: {
                livereload: true
            },

            html: {
                files: "index.html",
                tasks: ["html"]
            },

            css: {
                files: "scss/**/*.scss",
                tasks: ["css"]
            },

            js: {
                files: [
                    "js/**/*.js",
                    "!js/script.js",
                    "!js/vendor/*.js"
                ],

                tasks: ["js"]
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
