'use strict';
var gulp = require('gulp');
var scssLint = require('gulp-scss-lint');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var path = require('path');

gulp.task('serve', ['sass', 'templates', 'images', 'javascript'], function() {
  browserSync.init({
    server: './build',
    open: false
  });

  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['templates-watch']);
  gulp.watch('src/**/*.js', ['javascript-watch']);
});

gulp.task('scss-lint', function() {
  return gulp.src('src/**/*.scss')
    .pipe(scssLint());
});

gulp.task('sass', ['scss-lint', 'sass-copy'], function() {
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
      outputStyle: 'expanded',
      includePaths: [
        './node_modules/normalize.css/',
        'src/'
      ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie > 9', 'Android >= 4', 'iOS >= 7', 'ie_mob >= 8'],
      cascade: false
    }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

gulp.task('sass-copy', function() {
  gulp.src('src/**/*.scss')
    .pipe(gulp.dest('build/'));
});

gulp.task('templates-watch', ['templates'], function() {
  browserSync.reload();
});

gulp.task('templates', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('javascript-watch', ['javascript'], function() {
  browserSync.reload();
});

gulp.task('javascript', function() {
  gulp.src('src/**/*.js')
    .pipe(gulp.dest('build/'));
});

gulp.task('images', function() {
  gulp.src('src/**/*.png')
    .pipe(gulp.dest('build/'));
});

gulp.task('default', ['serve']);
