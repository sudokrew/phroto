var gulp = require('gulp'),
  compass = require('gulp-compass'),
  nodemon = require('gulp-nodemon'),
  notify = require('node-notifier'),
  refresh = require('gulp-livereload'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload'),
  plumber = require('gulp-plumber'),
  prefix = require('gulp-autoprefixer'),
  huxley = require('gulp-huxley'),
  livereloadport = 35729,
  serverport = 3000;

function handleError(err) {
  notify(err.toString());
  this.emit('end');
}

gulp.task('nodemon', function () {
  nodemon({
    options: "-e js,json",
    script: "app.js"
  });
});

//Task for sass using libsass through gulp-sass
gulp.task('sass', function(){
  gulp.src('./sass/styles.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: 'public/css',
      sass: 'sass'
    }))
    .pipe(prefix())
    .pipe(gulp.dest('public/css'))
    .pipe(refresh(lrserver))
    .on('error', function() {
      handleError(err);
    });
});

gulp.task('images', function () {
  gulp.src('./images/*')
    .pipe(refresh(lrserver))
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('js', function () {
  gulp.src('./js/**/*.js')
    .pipe(refresh(lrserver))
    .pipe(gulp.dest('./public/js/'));
});

// Copy bower components into public/js/libs
gulp.task('copy', function () {
  gulp.src('')
    .pipe(gulp.dest('./public/js/lib'));
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('images/*', ['images']);
  gulp.watch('js/**/*.js', ['js']);
});

gulp.task('huxley', function() {
  gulp.src('./test/**/Huxleyfile.json')
    .pipe( huxley({
      action: 'compare'
    }));
});

//Convenience task for running a one-off build
gulp.task('build', ['sass', 'js', 'images', 'copy']);

gulp.task('default', ['build', 'nodemon', 'watch']);
