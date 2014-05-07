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


    app.folder.vendor = JSON.parse(fs.readFileSync(app.config.bower, "utf8")).directory;

    app.regex = {
        html5shiv: new RegExp(app.regex.html5shiv),
        respond: new RegExp(app.regex.respond),

        main: new RegExp(app.regex.main)
    };


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
            options: {
                livereload: true
            },

            scss: {
                files: app.folder.scss +"/**/*.scss",
                tasks: ["css-init", "css-lint"]
            },

            stylus: {
                files: app.folder.stylus +"/**/*.styl",
                tasks: ["css-init", "autoprefixer:dev", "css-lint"]
            },

            js: {
                files: app.folder.js +"/**/*.js",
                tasks: ["js-init", "js-lint"]
            },

            template: {
                files: ["*.slim", app.folder.template +"/*.slim"],
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
                    app.folder.partial +"/"+ app.file.head,
                    app.folder.partial +"/"+ app.file.style,

                    app.folder.partial +"/"+ app.file.main,

                    app.folder.partial +"/"+ app.file.foot,
                    app.folder.partial +"/"+ app.file.script
                ],

                dest: app.folder.dist +"/"+ app.file.index
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
                    app.folder.partial +"/"+ app.file.head,
                    app.folder.partial +"/"+ app.file.style,

                    app.folder.partial +"/"+ app.file.main,

                    app.folder.partial +"/"+ app.file.foot,
                    app.folder.partial +"/"+ app.file.script,

                    app.folder.partial +"/"+ app.file.livereload
                ],

                dest: app.folder.dist +"/"+ app.file.index
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
                        src: app.folder.vendor +"/**/*.css",
                        dest: app.folder.dist +"/"
                    }, {
                        src: app.folder.vendor +"/**/*.js",
                        dest: app.folder.dist +"/"
                    }, {
                        src: app.folder.vendor +"/"+ app.vendor.html5shiv.path +"/"+ app.vendor.html5shiv.file,
                        dest: app.folder.js +"/"+ app.folder.vendor +"/"+ app.vendor.html5shiv.file
                    }, {
                        src: app.folder.vendor +"/"+ app.vendor.respond.path +"/"+ app.vendor.respond.file,
                        dest: app.folder.js +"/"+ app.folder.vendor +"/"+ app.vendor.respond.file
                    }
                ]
            },

            css: {
                src: app.folder.css +"/**/*.css",
                dest: app.folder.dist +"/"
            },

            js: {
                src: app.folder.js +"/**/*.js",
                dest: app.folder.dist +"/"
            },

            temp: {
                files: [
                    {
                        src: app.folder.temp +"/concat/"+ app.folder.css +"/"+ app.file.css,
                        dest: app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css
                    }, {
                        src: app.folder.temp +"/concat/"+ app.folder.js +"/"+ app.file.js,
                        dest: app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js
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

            all: {
                src: [
                    app.folder.css,
                    app.folder.js +"/"+ app.folder.vendor,
                    app.folder.partial,
                    app.folder.temp,
                    app.folder.dist
                ]
            },

            css: {
                src: app.folder.css
            },

            js: {
                src: app.folder.js +"/"+ app.folder.vendor
            },

            partial: {
                src: app.folder.partial
            },

            temp: {
                src: app.folder.temp
            },

            vendor: {
                src: app.folder.dist +"/"+ app.folder.vendor
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
                    app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css,
                    app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js
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

        bowerInstall: {
            dev: {
                src: [
                    app.template.style,
                    app.template.script
                ],

                exclude: [
                    app.regex.html5shiv,
                    app.regex.respond
                ]
            }
        },

        slim: {
            dev: {
                options: app.config.slim,

                files: [
                    {
                        src: app.template.style,
                        dest: app.folder.partial +"/"+ app.file.style
                    }, {
                        src: app.template.script,
                        dest: app.folder.partial +"/"+ app.file.script
                    }, {
                        src: app.folder.template +"/"+ app.template.head,
                        dest: app.folder.partial +"/"+ app.file.head
                    }, {
                        src: app.folder.template +"/"+ app.template.main,
                        dest: app.folder.partial +"/"+ app.file.main
                    }, {
                        src: app.folder.template +"/"+ app.template.foot,
                        dest: app.folder.partial +"/"+ app.file.foot
                    }, {
                        src: app.folder.template +"/"+ app.template.livereload,
                        dest: app.folder.partial +"/"+ app.file.livereload
                    }
                ]
            }
        },

        htmlmin: {
            dev: {
                src: app.folder.dist +"/"+ app.file.index,
                dest: app.folder.dist +"/"+ app.file.index
            },

            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },

                src: app.folder.dist +"/"+ app.file.index,
                dest: app.folder.dist +"/"+ app.file.index
            }
        },

        htmlhint: {
            options: {
                htmlhintrc: app.config.htmlhint
            },

            dist: {
                src: app.folder.dist +"/"+ app.file.index
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
                    config: app.config.compass
                }
            }
        },

        stylus: {
            options: app.config.stylus,

            dev: {
                src: app.folder.stylus +"/**/*.styl",
                dest: app.folder.css +"/"+ app.file.css
            }
        },

        autoprefixer: {
            dist: {
                src: app.folder.dist +"/"+ app.folder.css +"/**/*.css"
            }
        },

        csslint: {
            options: {
                csslintrc: app.config.csslint
            },

            dist: {
                src: app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css
            }
        },

        cssmin: {
            dist: {
                src: app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css,
                dest: app.folder.dist +"/"+ app.folder.css +"/"+ app.file.css
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

            js: {
                src: app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js
            }
        },

        uglify: {
            options: {
                preserveComments: "some"
            },

            dist: {
                src: app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js,
                dest: app.folder.dist +"/"+ app.folder.js +"/"+ app.file.js
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
    var preprocessor = grunt.option("pre") || app.preprocessor;

    /**
     * Create html file:
     *     - Create partial html files from slim templates
     *     - Concat partial html files into a single html file
     *     - Remove redudant code in the html file
     *     - Remove partial html files
     *
     *     * Add livereload.js to html when using html-watch task
     */
    grunt.registerTask("html-init", ["slim:dev", "concat:main", "htmlmin:dev", "clean:partial"]);
    grunt.registerTask("html-watch", ["slim:dev", "concat:watch", "htmlmin:dev", "clean:partial"]);

    /**
     * Lint html file:
     *     - Validate the html file
     */
    grunt.registerTask("html-lint", ["htmlhint:dist"]);

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
    grunt.registerTask("css-lint", ["csslint:dist"]);

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
     *
     *     * Add vendor prefix with autoprefixer when using stylus
     */
    grunt.registerTask("usemin-prepare", ["useminPrepare", "concat:generated", "copy:temp", "clean:vendor", "clean:temp"]);

    grunt.registerTask("usemin-prepare-compass", ["usemin-prepare"]);
    grunt.registerTask("usemin-prepare-stylus", ["usemin-prepare", "autoprefixer:dist"]);

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
    grunt.registerTask("clear", ["clean:all", "bowerInstall:dev"]);

    /**
     * Init task:
     *     - Lint Gruntfile.js
     *     - Clear task
     *     - Copy vendor files to distribution folder
     *     - Create css file
     *     - Create js file
     *     - Creat html file
     *
     *     * Add vendor prefix with autoprefixer when using stylus
     */
    grunt.registerTask("init", ["jshint:grunt", "clear", "copy:vendor", "css-init", "js-init", "html-init"]);

    grunt.registerTask("init-compass", ["init"]);
    grunt.registerTask("init-stylus", ["init", "autoprefixer:dist"]);

    /**
     * Reset task:
     *     - Init task
     *     - Lint css file
     *     - Lint js file
     *     - Lint html file
     */
    grunt.registerTask("reset", ["init-"+ preprocessor, "css-lint", "js-lint", "html-lint"]);

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
        "usemin-prepare-"+ preprocessor, "usemin-replace",
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
        "usemin-prepare-"+ preprocessor,
        "cssmin:dist", "uglify:dist",
        "usemin-replace",
        "htmlmin:dist", "html-lint"
    ]);
};
