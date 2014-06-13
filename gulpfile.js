var gulp = require('gulp'),
  compass = require('gulp-compass'),
  jade = require('gulp-jade'),
  notify = require('node-notifier'),
  refresh = require('gulp-livereload'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload'),
  plumber = require('gulp-plumber'),
  prefix = require('gulp-autoprefixer'),
  livereloadport = 35729,
  serverport = 3000;

function handleError(err) {
  notify(err.toString());
  this.emit('end');
}

//We only configure the server here and start it only when running the watch task
var server = express();
//Add livereload middleware before static-middleware
server.use(livereload({
  port: livereloadport
}));
server.use(express.static('./dist'));

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./templates/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(refresh(lrserver));
});

//Task for sass using libsass through gulp-sass
gulp.task('sass', function(){
  gulp.src('./sass/styles.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: 'dist/css',
      sass: 'sass'
    }))
    .pipe(prefix())
    .pipe(gulp.dest('dist/css'))
    .pipe(refresh(lrserver))
    .on('error', function() {
      handleError(err);
    });
});

gulp.task('images', function () {
  gulp.src('./images/*')
    .pipe(refresh(lrserver))
    .pipe(gulp.dest('./dist/images/'));
});

gulp.task('js', function () {
  gulp.src('./js/**/*.js')
    .pipe(refresh(lrserver))
    .pipe(gulp.dest('./dist/js/'));
});

// Copy bower components into dist/js/libs
gulp.task('copy', function () {
  gulp.src([
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/foundation/js/foundation.min.js'
  ]).pipe(gulp.dest('./dist/js/libs'));
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('images/*', ['images']);
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('templates/**/*.jade', ['templates']);
});

//Convenience task for running a one-off build
gulp.task('build', ['templates', 'sass', 'js', 'images', 'copy']);

gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);

  //Set up your livereload server
  lrserver.listen(livereloadport);
});

gulp.task('default', ['build', 'serve', 'watch']);
