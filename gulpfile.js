
var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-ruby-sass'),
    jade = require('gulp-jade'),
    coffee = require('gulp-coffee'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    ngAnnotate = require('browserify-ngannotate')
    livereload = require('gulp-livereload');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
    del([
        'dist'
    ], cb);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs bower to install frontend dependencies
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('bower', function() {

    var install = require("gulp-install");

    return gulp.src(['./bower.json'])
        .pipe(install());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function() {
    return sass('sass/', {sourcemap: true}) 
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(sourcemaps.write('./', {
        includeContent: false,
        sourceRoot: '/css'
    }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(livereload());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs jade
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jade', ['clean'], function() {
  return gulp.src('./templates/*.jade')
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs coffee
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('coffee', ['clean'], function() {
  gulp.src('./js/**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(sourcemaps.write('./', {
        includeContent: false,
        sourceRoot: '/js'
    }))
    .pipe(gulp.dest('./dist/js'))
});


/////////////////////////////////////////////////////////////////////////////////////
//
// Copy static assets
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('copy', ['clean'], function() {
  gulp.src('./images/**')
    .pipe(gulp.dest('./dist/images'));
 
  gulp.src('./css/*.css')
    .pipe(gulp.dest('./dist/css/vendor'));

  gulp.src('./js/vendor/*.js')
    .pipe(gulp.dest('./dist/js/vendor'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// fills in the Angular template cache, to prevent loading the html templates via
// separate http requests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-template-cache', ['clean'], function() {
    
    var ngHtml2Js = require("gulp-ng-html2js"),
        concat = require("gulp-concat");
    
    return gulp.src("./partials/*.html")
        .pipe(ngHtml2Js({
            moduleName: "todoPartials",
            prefix: "/partials/"
        }))
        .pipe(concat("templateCachePartials.js"))
        .pipe(gulp.dest("./dist"));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function() {
    gulp.src('/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


/////////////////////////////////////////////////////////////////////////////////////
//
// full build (except sprites), applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', [ 'clean', 'bower', 'build-css', 'jade', 'coffee', 'build-template-cache', 'jshint', 'copy'], function() {
    return gulp.src('index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// watches file system and triggers a build when a modification is detected
//
/////////////////////////////////////////////////////////////////////////////////////

// Watch
gulp.task('watch', function() {
  return gulp.watch(['./sass/**/*.sass', './js/**/*.coffee', './jade/**/*.jade'], ['build']);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launches a web server that serves files in the current directory
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('webserver', ['watch','build'], function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "http://localhost:8000/dist/index.html"
        }));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launch a build upon modification and publish it to a running server
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('dev', ['watch', 'webserver']);


/////////////////////////////////////////////////////////////////////////////////////
//
// installs and builds everything, including sprites
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['build']);