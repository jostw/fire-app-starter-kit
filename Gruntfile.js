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
    var app = {
        css: "css",
        js: "js",
        template: "template",
        partial: "partial",
        dist: "dist"
    };

    grunt.initConfig({
        app: app,
        pkg: grunt.file.readJSON("package.json"),

//  ######   ########  ##     ## ##    ## ########
// ##    ##  ##     ## ##     ## ###   ##    ##
// ##        ##     ## ##     ## ####  ##    ##
// ##   #### ########  ##     ## ## ## ##    ##
// ##    ##  ##   ##   ##     ## ##  ####    ##
// ##    ##  ##    ##  ##     ## ##   ###    ##
//  ######   ##     ##  #######  ##    ##    ##

        watch: {
            options: {
                livereload: true
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

        copy: {
            css: {
                src: "<%= app.css %>/style.css",
                dest: "<%= app.dist %>/<%= app.css %>/style.css",
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

// ##     ## ######## ##     ## ##
// ##     ##    ##    ###   ### ##
// ##     ##    ##    #### #### ##
// #########    ##    ## ### ## ##
// ##     ##    ##    ##     ## ##
// ##     ##    ##    ##     ## ##
// ##     ##    ##    ##     ## ########

        bowerInstall: {
            target: {
                src: [
                    "<%= app.template %>/_head.html.slim",
                    "<%= app.template %>/_foot.html.slim"
                ],

                cwd: ".",
                exclude: [
                    /html5shiv/,
                    /respond/
                ]
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

        validation: {
            options: {
                reportpath: false
            },

            files: {
                src: "<%= app.dist %>/index.html"
            }
        },

//  ######   ######   ######
// ##    ## ##    ## ##    ##
// ##       ##       ##
// ##        ######   ######
// ##             ##       ##
// ##    ## ##    ## ##    ##
//  ######   ######   ######

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

//       ##  ######
//       ## ##    ##
//       ## ##
//       ##  ######
// ##    ##       ##
// ##    ## ##    ##
//  ######   ######

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },

            grunt: {
                files: {
                    src: "Gruntfile.js"
                }
            },

            js: {
                files: {
                    src: "<%= app.js %>/script.js"
                }
            }
        }
    });

    // Load the plugins.
    require("load-grunt-tasks")(grunt);

// ##     ## ######## ##     ## ##               ########    ###     ######  ##    ##  ######
// ##     ##    ##    ###   ### ##                  ##      ## ##   ##    ## ##   ##  ##    ##
// ##     ##    ##    #### #### ##                  ##     ##   ##  ##       ##  ##   ##
// #########    ##    ## ### ## ##       #######    ##    ##     ##  ######  #####     ######
// ##     ##    ##    ##     ## ##                  ##    #########       ## ##  ##         ##
// ##     ##    ##    ##     ## ##                  ##    ##     ## ##    ## ##   ##  ##    ##
// ##     ##    ##    ##     ## ########            ##    ##     ##  ######  ##    ##  ######

    grunt.registerTask("html-start", ["bowerInstall", "slim:dev", "concat:main", "clean:partial"]);
    grunt.registerTask("html-end", ["validation", "clean:validation"]);

    grunt.registerTask("html-reset", ["html-start", "htmlmin:dev", "html-end"]);
    grunt.registerTask("html-build", ["html-start", "htmlmin:dist", "html-end"]);

//  ######   ######   ######          ########    ###     ######  ##    ##  ######
// ##    ## ##    ## ##    ##            ##      ## ##   ##    ## ##   ##  ##    ##
// ##       ##       ##                  ##     ##   ##  ##       ##  ##   ##
// ##        ######   ######  #######    ##    ##     ##  ######  #####     ######
// ##             ##       ##            ##    #########       ## ##  ##         ##
// ##    ## ##    ## ##    ##            ##    ##     ## ##    ## ##   ##  ##    ##
//  ######   ######   ######             ##    ##     ##  ######  ##    ##  ######

    grunt.registerTask("css-start", ["clean:css"]);
    grunt.registerTask("css-end", ["csslint", "copy:css"]);

    grunt.registerTask("css-reset", ["css-start", "compass:dev", "css-end"]);
    grunt.registerTask("css-build", ["css-start", "compass:dist", "css-end"]);

//       ##  ######          ########    ###     ######  ##    ##  ######
//       ## ##    ##            ##      ## ##   ##    ## ##   ##  ##    ##
//       ## ##                  ##     ##   ##  ##       ##  ##   ##
//       ##  ######  #######    ##    ##     ##  ######  #####     ######
// ##    ##       ##            ##    #########       ## ##  ##         ##
// ##    ## ##    ##            ##    ##     ## ##    ## ##   ##  ##    ##
//  ######   ######             ##    ##     ##  ######  ##    ##  ######

    grunt.registerTask("js-start", ["jshint:js"]);

    grunt.registerTask("js-reset", ["js-start"]);
    grunt.registerTask("js-build", ["js-start"]);

// ########    ###     ######  ##    ##  ######
//    ##      ## ##   ##    ## ##   ##  ##    ##
//    ##     ##   ##  ##       ##  ##   ##
//    ##    ##     ##  ######  #####     ######
//    ##    #########       ## ##  ##         ##
//    ##    ##     ## ##    ## ##   ##  ##    ##
//    ##    ##     ##  ######  ##    ##  ######

    grunt.registerTask("default", ["jshint:grunt", "watch"]);

    grunt.registerTask("reset", ["jshint:grunt", "css-reset", "js-reset", "html-reset"]);
    grunt.registerTask("build", ["jshint:grunt", "css-build", "js-build", "html-build"]);
};
