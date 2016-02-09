// Node modules
var
  debugging = true,
  fs = require('fs'),
  vm = require('vm'),
  merge = require('deeply'),
  chalk = require('chalk'),
  es = require('event-stream');

// Gulp and plugins
var
  gulp = require('gulp'),
  rjs = require('gulp-requirejs-bundler'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  replace = require('gulp-replace'),
  uglify = require('gulp-uglify'),
  htmlreplace = require('gulp-html-replace'),
  rename = require('gulp-rename');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
  out: 'scripts.js',
  baseUrl: './src',
  name: 'app/startup',
  paths: {
    requireLib: 'bower_modules/requirejs/require'
  },
  include: [
    'requireLib',
    'components/nav-bar/nav-bar',
	'components/common/basecomponent',
	'components/common/persistable',
	'components/common/basecomponent',
	'text!components/blank-page/blank-page.html'
  ],
  insertRequire: ['app/startup'],
  bundles: {
    'home-page': ['components/home-page/home-page'],
    'about-page': ['text!components/about-page/about-page.html'],
    'services-page': ['components/services-page/services-page'],
    'software-page': ['components/software-page/software-page'],
    'contact-page': ['components/contact-page/contact-page']
  }
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', function () {
  var result = rjs(requireJsOptimizerConfig);
  if(debugging)
  result = result.pipe(uglify({ preserveComments: 'some' }));
  result = result.pipe(gulp.dest('./dist/'));
  return result;
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
	var bowerCss = gulp.src([
		'src/bower_modules/components-bootstrap/css/bootstrap.min.css',
		'src/bower_modules/toastr/toastr.css',
		'src/bower_modules/chosen/chosen.min.css'
	]);
	bowerCss = bowerCss.pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/'));
	bowerCss = bowerCss.pipe(replace(/url\((')?chosen-sprite/g, 'url($1images/chosen-sprite'));
	var appCss = gulp.src('src/css/*.css');
	var combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css'));
	var fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' });
	var imageFiles = gulp.src('./src/bower_modules/chosen/*.png');
	imageFiles = imageFiles.pipe(rename(function (path) { path.dirname += "/images";}));
	var result = es.concat(combinedCss, fontFiles, imageFiles);
	result = result.pipe(gulp.dest('./dist/'));
	return result;
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
  var result = gulp.src('./src/index.html');
  result = result.pipe(htmlreplace({
    'css': 'css.css',
    'js': 'scripts.js'
  }));
  result = result.pipe(gulp.dest('./dist/'));
  return result;
});

// Removes all files from ./dist/
gulp.task('clean', function() {
  var result = gulp.src('./dist/**/*', { read: false });
  result = result.pipe(clean());
  return result;
});

gulp.task('default', ['html', 'js', 'css'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
