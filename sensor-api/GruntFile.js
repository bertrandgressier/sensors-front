module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({

        // istanbul launch mocha
        mocha_istanbul: {
            coverage: {
                src: 'ut/test/**/*.js'
            }
        },
        istanbul_check_coverage: {
            default: {
                options: {
                    coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
                    check: {
                        lines: 80,
                        statements: 80
                    }
                }
            }
        },

        clean : {
            coverage : ['coverage']
        },

        nodemon: {
            dev: {
                script: 'src/app.js',

                options : {
                    watch: ['src'],
                    legacyWatch: true
                }
            }
        }
    });

    grunt.registerTask('test', ['clean', 'mocha_istanbul']);
    grunt.registerTask('default', ['nodemon']);
};
