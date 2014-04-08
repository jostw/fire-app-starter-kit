module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

	watch: {
            options: {
                livereload: true
            }
        }
    });

    // Load the plugins.
    require("load-grunt-tasks")(grunt);
 
    // Default task(s).
    grunt.registerTask("default", ["watch"]);
};

