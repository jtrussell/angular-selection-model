/*jshint node:true */
'use strict';

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: 'gruntfile.js',
      src: 'src/**/*.js',
      test: 'test/**/*.js'
    },

    clean: ['dist'],

    concat: {
      options: {separator: '\n'},
      dist: {
        src: ['src/scripts/module.js', 'src/scripts/**/*.js'],
        dest: 'dist/selection-model.js'
      }
    },

    uglify: {
      dist: {
        src: 'dist/selection-model.js',
        dest: 'dist/selection-model.min.js'
      }
    },

    watch: {
      scripts: {
        files: 'src/scripts/**/*.js',
        tasks: ['jshint', 'build']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['dist/*', 'examples/**/*']
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          base: ['dist', 'bower_components', 'examples'],
          livereload: true,
          open: 'http://localhost:9000/index.html'
        }
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register tasks
  grunt.registerTask('server', [
    'clean',
    'jshint',
    'build',
    'connect',
    'watch'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'clean',
    'jshint',
    'karma',
    'build'
  ]);

};
