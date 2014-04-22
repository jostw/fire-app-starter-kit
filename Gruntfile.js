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
        config: {
            grunt: "package.json",

            compass: "config.rb",

            csslint: ".csslintrc",
            jshint: ".jshintrc"
        },

        folder: {
            scss: "scss",
            stylus: "stylus",

            css: "css",
            js: "js",

            template: "template",
            partial: "partial",

            vendor: "vendor",
            temp: ".tmp",

            dist: "dist"
        },

        template: {
            style: "_style.html.slim",
            script: "_script.html.slim",

            head: "_head.html.slim",
            main: "_main.html.slim",
            foot: "_foot.html.slim",

            livereload: "_livereload.html.slim"
        },

        file: {
            grunt: "Gruntfile.js",

            css: "style.css",
            js: "script.js",

            style: "style.html",
            script: "script.html",

            head: "head.html",
            main: "main.html",
            foot: "foot.html",

            livereload: "livereload.html",

            index: "index.html"
        },

        regex: {
            html5shiv: /html5shiv/,
            respond: /respond/,

            main: /main/
        },

        vendor: {
            html5shiv: {
                path: "html5shiv/dist/",
                file: "html5shiv.js"
            },

            respond: {
                path: "respond/dest/",
                file: "respond.min.js"
            },

            validation: "validation-status.json"
        }
    };

    grunt.initConfig({
        app: app,
        pkg: grunt.file.readJSON(app.config.grunt),

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

            css: {
                files: ["<%= app.folder.scss %>/**/*.scss", "<%= app.folder.stylus %>/**/*.styl"],
                tasks: ["css-init", "css-lint"]
            },

            js: {
                files: "<%= app.folder.js %>/**/*.js",
                tasks: ["js-init", "js-lint"]
            },

            template: {
                files: ["*.slim", "<%= app.folder.template %>/*.slim"],
                tasks: ["html-watch", "html-lint"]
            }
        },

//  ######   #######  ##    ##  ######     ###    ########
// ##    ## ##     ## ###   ## ##    ##   ## ##      ##
// ##       ##     ## ####  ## ##        ##   ##     ##
// ##       ##     ## ## ## ## ##       ##     ##    ##
// ##       ##     ## ##  #### ##       #########    ##
// ##    ## ##     ## ##   ### ##    ## ##     ##    ##
//  ######   #######  ##    ##  ######  ##     ##    ##

        concat: {
            main: {
                options: {
                    banner: "<!DOCTYPE html>\n<html lang=\"zh-TW\">\n<head>\n",

                    process: function(src, filepath) {
                        if(filepath.match(app.regex.main)) {
                            src = "</head>\n<body>\n"+ src;
                        }

                        return src;
                    },

                    footer: "</body>\n</html>\n"
                },

                src: [
                    "<%= app.folder.partial %>/<%= app.file.head %>",
                    "<%= app.folder.partial %>/<%= app.file.style %>",

                    "<%= app.folder.partial %>/<%= app.file.main %>",

                    "<%= app.folder.partial %>/<%= app.file.foot %>",
                    "<%= app.folder.partial %>/<%= app.file.script %>"
                ],

                dest: "<%= app.folder.dist %>/<%= app.file.index %>"
            },

            watch: {
                options: {
                    banner: "<!DOCTYPE html>\n<html lang=\"zh-TW\">\n<head>\n",

                    process: function(src, filepath) {
                        if(filepath.match(app.regex.main)) {
                            src = "</head>\n<body>\n"+ src;
                        }

                        return src;
                    },

                    footer: "</body>\n</html>\n"
                },

                src: [
                    "<%= app.folder.partial %>/<%= app.file.head %>",
                    "<%= app.folder.partial %>/<%= app.file.style %>",

                    "<%= app.folder.partial %>/<%= app.file.main %>",

                    "<%= app.folder.partial %>/<%= app.file.foot %>",
                    "<%= app.folder.partial %>/<%= app.file.script %>",

                    "<%= app.folder.partial %>/<%= app.file.livereload %>"
                ],

                dest: "<%= app.folder.dist %>/<%= app.file.index %>"
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
                files: [
                    {
                        src: "<%= app.folder.vendor %>/**/*.css",
                        dest: "<%= app.folder.dist %>/"
                    }, {
                        src: "<%= app.folder.vendor %>/**/*.js",
                        dest: "<%= app.folder.dist %>/"
                    }, {
                        expand: true,
                        cwd: "<%= app.folder.vendor %>/<%= app.vendor.html5shiv.path %>",
                        src: "<%= app.vendor.html5shiv.file %>",
                        dest: "<%= app.folder.js %>/<%= app.folder.vendor %>/"
                    }, {
                        expand: true,
                        cwd: "<%= app.folder.vendor %>/<%= app.vendor.respond.path %>",
                        src: "<%= app.vendor.respond.file %>",
                        dest: "<%= app.folder.js %>/<%= app.folder.vendor %>/"
                    }
                ]
            },

            css: {
                src: "<%= app.folder.css %>/**/*.css",
                dest: "<%= app.folder.dist %>/"
            },

            js: {
                src: "<%= app.folder.js %>/**/*.js",
                dest: "<%= app.folder.dist %>/"
            },

            temp: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= app.folder.temp %>/concat/<%= app.folder.css %>/",
                        src: "<%= app.file.css %>",
                        dest: "<%= app.folder.dist %>/<%= app.folder.css %>/"
                    }, {
                        expand: true,
                        cwd: "<%= app.folder.temp %>/concat/<%= app.folder.js %>/",
                        src: "<%= app.file.js %>",
                        dest: "<%= app.folder.dist %>/<%= app.folder.js %>/"
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

            all: {
                src: [
                    "<%= app.folder.css %>",
                    "<%= app.folder.js %>/<%= app.folder.vendor %>",
                    "<%= app.folder.partial %>",
                    "<%= app.folder.temp %>",
                    "<%= app.folder.dist %>"
                ]
            },

            css: {
                src: "<%= app.folder.css %>"
            },

            js: {
                src: "<%= app.folder.js %>/<%= app.folder.vendor %>"
            },

            partial: {
                src: "<%= app.folder.partial %>"
            },

            validation: {
                src: "<%= app.vendor.validation %>"
            },

            temp: {
                src: "<%= app.folder.temp %>"
            },

            vendor: {
                src: [
                    "<%= app.folder.dist %>/<%= app.folder.vendor %>"
                ]
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
                files: {
                    src: [
                        "<%= app.folder.dist %>/<%= app.folder.css %>/<%= app.file.css %>",
                        "<%= app.folder.dist %>/<%= app.folder.js %>/<%= app.file.js %>"
                    ]
                }
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
                dest: "<%= app.folder.dist %>"
            },

            html: "<%= app.folder.dist %>/<%= app.file.index %>"
        },

        usemin: {
            options: {
                assetsDirs: ["<%= app.folder.dist %>"]
            },

            html: ["<%= app.folder.dist %>/<%= app.file.index %>"]
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
                    "<%= app.template.style %>",
                    "<%= app.template.script %>"
                ],

                exclude: [
                    "<%= app.regex.html5shiv %>",
                    "<%= app.regex.respond %>"
                ]
            }
        },

        slim: {
            dev: {
                options: {
                    pretty: true
                },

                files: {
                    "<%= app.folder.partial %>/<%= app.file.style %>": "<%= app.template.style %>",
                    "<%= app.folder.partial %>/<%= app.file.script %>": "<%= app.template.script %>",

                    "<%= app.folder.partial %>/<%= app.file.head %>": "<%= app.folder.template %>/<%= app.template.head %>",
                    "<%= app.folder.partial %>/<%= app.file.main %>": "<%= app.folder.template %>/<%= app.template.main %>",
                    "<%= app.folder.partial %>/<%= app.file.foot %>": "<%= app.folder.template %>/<%= app.template.foot %>",

                    "<%= app.folder.partial %>/<%= app.file.livereload %>": "<%= app.folder.template %>/<%= app.template.livereload %>"
                }
            }
        },

        htmlmin: {
            dev: {
                files: {
                    "<%= app.folder.dist %>/<%= app.file.index %>": "<%= app.folder.dist %>/<%= app.file.index %>"
                }
            },

            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                files: {
                    "<%= app.folder.dist %>/<%= app.file.index %>": "<%= app.folder.dist %>/<%= app.file.index %>"
                }
            }
        },

        validation: {
            options: {
                reportpath: false
            },

            files: {
                src: "<%= app.folder.dist %>/<%= app.file.index %>"
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
            dev: {
                options: {
                    config: "<%= app.config.compass %>"
                }
            }
        },

        stylus: {
            options: {
                compress: false
            },

            dev: {
                files: {
                    "<%= app.folder.css %>/<%= app.file.css %>": "<%= app.folder.stylus %>/**/*.styl"
                }
            }
        },

        csslint: {
            options: {
                csslintrc: "<%= app.config.csslint %>"
            },

            src: "<%= app.folder.dist %>/<%= app.folder.css %>/<%= app.file.css %>"
        },

        cssmin: {
            dist: {
                files: {
                    "<%= app.folder.dist %>/<%= app.folder.css %>/<%= app.file.css %>": "<%= app.folder.dist %>/<%= app.folder.css %>/<%= app.file.css %>"
                }
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
                jshintrc: "<%= app.config.jshint %>"
            },

            grunt: {
                files: {
                    src: "<%= app.file.grunt %>"
                }
            },

            js: {
                files: {
                    src: "<%= app.folder.dist %>/<%= app.folder.js %>/<%= app.file.js %>"
                }
            }
        },

        uglify: {
            options: {
                preserveComments: "some"
            },

            dist: {
                files: {
                    "<%= app.folder.dist %>/<%= app.folder.js %>/<%= app.file.js %>": ["<%= app.folder.dist %>/<%= app.folder.js %>/<%= app.file.js %>"]
                }
            }
        }
    });

    // Load the plugins.
    require("load-grunt-tasks")(grunt);

//  ######  ##     ## ########  ########    ###     ######  ##    ##  ######
// ##    ## ##     ## ##     ##    ##      ## ##   ##    ## ##   ##  ##    ##
// ##       ##     ## ##     ##    ##     ##   ##  ##       ##  ##   ##
//  ######  ##     ## ########     ##    ##     ##  ######  #####     ######
//       ## ##     ## ##     ##    ##    #########       ## ##  ##         ##
// ##    ## ##     ## ##     ##    ##    ##     ## ##    ## ##   ##  ##    ##
//  ######   #######  ########     ##    ##     ##  ######  ##    ##  ######

    /**
     * Usage: grunt [task] [--pre=stylus]
     *     - Use compass as default preprocessor
     */
    var preprocessor = grunt.option("pre") || "compass";

    /**
     * Create html file:
     *     - Create partial html files from slim templates
     *     - Concat partial html files into a single html file
     *     - Remove redudant code in the html file
     *     - Remove partial html files
     *
     *     * html-watch task added livereload.js to html
     */
    grunt.registerTask("html-init", ["slim:dev", "concat:main", "htmlmin:dev", "clean:partial"]);
    grunt.registerTask("html-watch", ["slim:dev", "concat:watch", "htmlmin:dev", "clean:partial"]);

    /**
     * Lint html file:
     *     - Validate the html file
     *     - Remove the validation results file
     */
    grunt.registerTask("html-lint", ["validation", "clean:validation"]);

    /**
     * Create css file:
     *     - Create a css file from scss/stylus files
     *     - Copy the css file to distribution folder
     *     - Remove the original css file
     */
    grunt.registerTask("css-init", [preprocessor +":dev", "copy:css", "clean:css"]);

    /**
     * Lint css file:
     *     - Lint css file in distribution folder
     */
    grunt.registerTask("css-lint", ["csslint"]);

    /**
     * Create js file:
     *     - Copy js file to distribution folder
     *     - Remove vendor folder in js folder
     */
    grunt.registerTask("js-init", ["copy:js", "clean:js"]);

    /**
     * Lint js file:
     *     - Lint js file in distribution folder
     */
    grunt.registerTask("js-lint", ["jshint:js"]);

    /**
     * Usemin prepare:
     *     - Set source file and destination folder
     *     - Concat assests files into a single file in temp folder
     *     - Copy files in temp folder to distribution folder
     *     - Remove vendor folder in distribution folder
     *     - Remove temp folder
     */
    grunt.registerTask("usemin-prepare", ["useminPrepare", "concat:generated", "copy:temp", "clean:vendor", "clean:temp"]);

    /**
     * Usemin replace:
     *     - Revision files name
     *     - Replace assests files to single file
     */
    grunt.registerTask("usemin-replace", ["rev:dist", "usemin"]);

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
     *     - html-watch task
     *     - Watch files
     */
    grunt.registerTask("default", ["jshint:grunt", "html-watch", "watch"]);

    /**
     * Clear task:
     *     - Remove all generated files
     *     - Insert bower files into slim templates
     */
    grunt.registerTask("clear", ["clean:all", "bowerInstall"]);

    /**
     * Init task:
     *     - Lint Gruntfile.js
     *     - Clear task
     *     - Copy vendor files to distribution folder
     *     - Create css file
     *     - Create js file
     *     - Creat html file
     */
    grunt.registerTask("init", ["jshint:grunt", "clear", "copy:vendor", "css-init", "js-init", "html-init"]);

    /**
     * Reset task:
     *     - Init task
     *     - Lint css file
     *     - Lint js file
     *     - Lint html file
     */
    grunt.registerTask("reset", ["init", "css-lint", "js-lint", "html-lint"]);

    /**
     * Build task:
     *     - Init task
     *     - Usemin prepare
     *     - Usemin replace
     *     - Remove redudant code in the html file
     *     - Lint html file
     *
     *     * Lint css and js file are discarded due to merging files from vendor files
     */
    grunt.registerTask("build", [
        "init",
        "usemin-prepare", "usemin-replace",
        "htmlmin:dev", "html-lint"
    ]);

    /**
     * Min task::
     *     - Init task
     *     - Usemin prepare
     *     - Compress css file
     *     - Compress js file
     *     - Usemin replace
     *     - Compress html file
     *     - Lint html file
     *
     *     * Lint css and js file are discarded due to merging files from vendor files
     */
    grunt.registerTask("min", [
        "init",
        "usemin-prepare",
        "cssmin:dist", "uglify:dist",
        "usemin-replace",
        "htmlmin:dist", "html-lint"
    ]);
};
