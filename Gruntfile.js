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
    grunt.initConfig({
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
        }
    });

    // Load the plugins.
    require("load-grunt-tasks")(grunt);

    // Default task(s).
    grunt.registerTask("default", ["jshint:grunt", "watch"]);
};
