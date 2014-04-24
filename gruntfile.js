/*jshint node:true */

module.exports = function(grunt) {
  'use strict';

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

    clean: {
      dist: 'dist',
      examples: 'examples/vendor/angular-selection-model/*'
    },

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

    copy: {
      examples: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: '*',
          dest: 'examples/vendor/angular-selection-model/',
          filter: 'isFile'
        }]
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: ['src/scripts/**/*.js', 'examples/*.{js,html}'],
        tasks: ['jshint', 'build']
      }
    },

    connect: {
       examples: {
        options: {
          port: 9000,
          base: ['examples'],
          livereload: true,
          open: 'http://localhost:9000/index.html'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true,
        browsers: [process.env.KARMA_BROWSER || 'Firefox']
      }
    },
    
    bump: {
      options: {
        commitMessage: 'chore: Bump for release (v%VERSION%)',
        files: ['package.json', 'bower.json'],
        commitFiles: ['-a'],
        push: false
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register tasks
  grunt.registerTask('serve', [
    'clean',
    'jshint',
    'build',
    'connect',
    'watch'
  ]);

  grunt.registerTask('server', ['serve']);

  grunt.registerTask('test', [
    'jshint',
    'karma'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'copy'
  ]);

  grunt.registerTask('default', [
    'clean',
    'test',
    'build'
  ]);

};
