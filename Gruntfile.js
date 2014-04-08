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
        css: "css",
        template: "template",
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
                    src: "Gruntfile.js"
                }
            }
        },

        slim: {
            dev: {
                options: {
                    pretty: true
                },

                files: {
                    "<%= app.partial %>/head.html": "<%= app.template %>/_head.html.slim",
                    "<%= app.partial %>/main.html": "<%= app.template %>/_main.html.slim",
                    "<%= app.partial %>/foot.html": "<%= app.template %>/_foot.html.slim"
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

            css: {
                src: "<%= app.css %>/style.css"
            },

            partial: {
                src: "<%= app.partial %>"
            },

            validation: {
                src: "validation-status.json"
            }
        },

        validation: {
            options: {
                reportpath: false
            },

            files: {
                src: "<%= app.dist %>/index.html"
            }
        },

        compass: {
            options: {
                config: "config.rb"
            },

            dev: {
                options: {
                    outputStyle: "compact"
                }
            },

            dist: {
                options: {
                    outputStyle: "compressed"
                }
            }
        },

        csslint: {
            options: {
                csslintrc: ".csslintrc"
            },

            src: "<%= app.css %>/style.css"
        },

        copy: {
            css: {
                src: "<%= app.css %>/style.css",
                dest: "<%= app.dist %>/<%= app.css %>/style.css",
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

    grunt.registerTask("slim-concat", [
        "slim:dev", "concat:main", "clean:partial",
    ]);

    grunt.registerTask("reset", [
        "jshint:grunt",
        "clean:css", "compass:dev", "csslint", "copy:css",
        "slim-concat",
        "htmlmin:dev", "validation", "clean:validation"
    ]);

    grunt.registerTask("build", [
        "jshint:grunt",
        "clean:css", "compass:dist", "csslint", "copy:css",
        "slim-concat",
        "htmlmin:dist", "validation", "clean:validation"
    ]);
};
