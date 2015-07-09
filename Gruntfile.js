/*
 * fire-app-starter-kit
 *
 * https://github.com/jostw/fire-app-starter-kit
 *
 * Copyright (c) 2015 jos
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        connect: {
            server: {
                options: {
                    port: 24681,
                    livereload: 35729
                }
            }
        },

        watch: {
            html: {
                files: "*.html",
                tasks: "build:html"
            },

            css: {
                files: "scss/**/*.scss",
                tasks: "build:css"
            },

            js: {
                files: [
                    "js/**/*.js",
                    "!js/script.js"
                ],

                tasks: "build:js"
            }
        },

        copy: {
            vendor: {
                files: [
                    {
                        src: "bower_components/html5shiv/dist/html5shiv.min.js",
                        dest: "js/vendor/html5shiv.min.js"
                    }, {
                        src: "bower_components/respond/dest/respond.min.js",
                        dest: "js/vendor/respond.min.js"
                    }, {
                        src: "bower_components/normalize.css/normalize.css",
                        dest: "scss/vendor/_normalize.scss"
                    }
                ]
            }
        },

        htmlhint: {
            options: {
                htmlhintrc: ".htmlhintrc"
            },

            src: "*.html"
        },

        compass: {
            style: {
                options: {
                    config: "config.rb"
                }
            }
        },

        csslint: {
            options: {
                csslintrc: ".csslintrc"
            },

            src: "css/*.css"
        },

        cssmin: {
            style: {
                src: "css/style.css",
                dest: "css/style.css"
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },

            src: [
                "Gruntfile.js",
                "js/**/*.js",
                "!js/script.js",
                "!js/app/plugins.js",
                "!js/vendor/*.js"
            ]
        },

        browserify: {
            app: {
                src: "js/app/app.js",
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
            },

            script: {
                src: "js/script.js",
                dest: "js/script.js"
            }
        }
    });

    require("load-grunt-tasks")(grunt);

    grunt.registerTask("default", [
        "connect:server",
        "watch"
    ]);

    grunt.registerTask("build:html", [
        "htmlhint"
    ]);

    grunt.registerTask("build:css", [
        "compass:style",
        "csslint",
        "cssmin:style"
    ]);

    grunt.registerTask("build:js", [
        "jshint",
        "browserify:app",
        "uglify:script"
    ]);

    grunt.registerTask("build", [
        "build:html",
        "build:css",
        "build:js"
    ]);
};
