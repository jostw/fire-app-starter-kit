/*
 * hello-project
 *
 * https://github.com/jostw/hello-project
 *
 * The MIT License (MIT)
 * Copyright (c) 2014 jos
 */

"use strict";

module.exports = function(grunt) {
    var app = {
        partial: "partial",
        dist: "dist"
    };

    grunt.initConfig({
        app: app,
        pkg: grunt.file.readJSON("package.json"),

        watch: {
            options: {
                livereload: true
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },

            grunt: {
                files: {
                    src: ["Gruntfile.js"]
                }
            }
        },

        slim: {
            dev: {
                options: {
                    pretty: true
                },

                files: {
                    "<%= app.partial %>/head.html": "template/_head.html.slim",
                    "<%= app.partial %>/main.html": "template/_main.html.slim",
                    "<%= app.partial %>/foot.html": "template/_foot.html.slim"
                }
            }
        },

        concat: {
            options: {
                banner: "<!DOCTYPE html>\n<html lang=\"zh-TW\">\n<head>\n",

                process: function(src, filepath) {
                    if(filepath.match(/main/)) {
                        src = "</head>\n<body>\n"+ src;
                    }

                    return src;
                },

                footer: "</body>\n</html>\n"
            },

            main: {
                src: [
                    "<%= app.partial %>/head.html",
                    "<%= app.partial %>/main.html",
                    "<%= app.partial %>/foot.html"
                ],

                dest: "<%= app.dist %>/index.html"
            }
        },

        htmlmin: {
            dev: {
                files: {
                    "<%= app.dist %>/index.html": "<%= app.dist %>/index.html"
                }
            },

            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                files: {
                    "<%= app.dist %>/index.html": "<%= app.dist %>/index.html"
                }
            }
        },

        clean: {
            options: {
                force: true
            },

            partial: {
                src: [
                    "<%= app.partial %>"
                ]
            }
        }
    });

    // Load the plugins.
    require("load-grunt-tasks")(grunt);

    // Default task(s).
    grunt.registerTask("default", [
        "jshint:grunt",
        "watch"
    ]);

    grunt.registerTask("reset", [
        "jshint:grunt",
        "slim:dev", "concat:main", "htmlmin:dev", "clean:partial"
    ]);

    grunt.registerTask("build", [
        "jshint:grunt",
        "slim:dev", "concat:main", "htmlmin:dist", "clean:partial"
    ]);
};
