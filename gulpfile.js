'use strict';
var gulp = require('gulp');
var scssLint = require('gulp-scss-lint');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('serve', ['sass', 'templates'], function() {
  browserSync.init({
    server: './build',
    open: false
  });

  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['templates-watch']);
});

gulp.task('scss-lint', function() {
  return gulp.src('src/**/*.scss')
    .pipe(scssLint());
});

gulp.task('sass', ['scss-lint'], function() {
  return gulp.src('src/**/*.scss')
    .pipe(plumber(function(error) {
      gutil.log(error.toString());
      notify().write({
        title: 'SASS Error',
        message: error.message
      });
      this.emit('end');
    }))
    .pipe(sass({
      includePaths: [
        './node_modules/normalize.css/',
        'src/'
      ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie > 9', 'Android >= 4', 'iOS >= 7', 'ie_mob >= 8'],
      cascade: false
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('templates-watch', ['templates'], function() {
  browserSync.reload();
});

gulp.task('templates', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('default', ['serve']);
