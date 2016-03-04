// Node modules
var
    argv = require('yargs').argv;
	fs = require('fs'),
	vm = require('vm'),
	merge = require('deeply'),
	chalk = require('chalk'),
	es = require('event-stream');

// Gulp and plugins
var
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync'),
	filter = require('gulp-ignore'),
	debug = require('gulp-debug');

// HTML Plugins
var 
	htmlreplace = require('gulp-html-replace'),
	htmlmin = require('gulp-htmlmin');

// Javascript Plugins
var
	replace = require('gulp-replace'),
	rjs = require('gulp-requirejs-bundler'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint');

// Css Plugins
var
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css');
	
//Image Processesing
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');

// Config
var output = './wwwroot/';

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

//Process all images
gulp.task('images', function () {
    gulp.src('src/images/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest(output + 'images/'));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', function () {
    var alljsfiles = [];
    var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
    var requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require',
            googlemaps: 'empty:'
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
            'contact-page': ['components/contact-page/contact-page'],
            'resume-page': ['components/resume-page/resume-page'],
            'map-page': ['components/map-page/map-page']
        },
        onBuildRead: function (moduleName, path, contents) { alljsfiles.push(path); return contents; }
    });

    var promise2,promise1 = new Promise(function (resolve1, reject) { promise2 = new Promise(function (resolve2, reject) {
        rjs(requireJsOptimizerConfig)
        //.pipe(plumber({
        //    errorHandler: function (error) {
        //        console.log(error.message);
        //        this.emit('end');
        //    }
        //}))
        .on('error', reject)
        .pipe(gulpif(!argv.Debug, uglify({ preserveComments: 'some' })))
        .on('end', function () {
            alljsfiles.push('!src/bower_modules/**');
            console.log(alljsfiles.reduce(function (a, b) { return a + ',' + b; }));
            gulp.src(alljsfiles)
                //.pipe(filter.exclude('src/bower_modules/'))
                .pipe(jshint())
                .pipe(jshint.reporter(require('jshint-stylish')))
                .on('end', resolve1);
        })
        //.pipe(debug())
        //.pipe(filter.exclude(requireJsOptimizerConfig.out))
        //.pipe(jshint())
        //.pipe(jshint.reporter(require('jshint-stylish')))
        //.pipe(srcadd(requireJsOptimizerConfig.out))
        .pipe(gulp.dest(output))
        .pipe(browserSync.reload({ stream: true }))
        .on('end', resolve2);
    })});
    return Promise.all([promise1, promise2]);
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src([
		'src/bower_modules/components-bootstrap/css/bootstrap.min.css',
		'src/bower_modules/toastr/toastr.css',
		'src/bower_modules/chosen/chosen.min.css'])
        .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/'))
        .pipe(replace(/url\((')?chosen-sprite/g, 'url($1images/chosen-sprite'));
	var appCss = gulp.src('src/css/*.css');
	var combinedCss = es.concat(bowerCss, appCss)
		.pipe(concat('css.css'))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(minifycss());
	var fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' });
	var imageFiles = gulp.src(['./src/bower_modules/chosen/*.png'])
        .pipe(rename(function (path) { path.dirname += "/images"; }))
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }));
	return es.concat(combinedCss, fontFiles, imageFiles)
        .pipe(gulpif(argv.GulpDebug,debug()))
        .pipe(gulp.dest(output));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
	var result = gulp.src('./src/index.html');
	result = result.pipe(htmlreplace({
		'css': 'css.css',
		'js': 'scripts.js'}))
        .pipe(gulp.dest(output))
        .pipe(gulpif(argv.GulpDebug, debug()));
	return result;
});

// Removes all files from output
gulp.task('clean', function() {
	var result = gulp.src(output + '**/*', { read: false });
	result = result.pipe(clean());
	return result;
});

gulp.task('test', function () {
    debugger;
    return gulp.src('');
});

gulp.task('build', ['html', 'js', 'css', 'images'], function(callback) {
	callback();
	console.log('\nPlaced optimized files in ' + chalk.magenta(output + '\n'));
});

gulp.task('default', ['build'], function(callback) {
    callback();
    if (argv.Release) {
        console.log('\n' + chalk.magenta('Production code ready') + '\n');
    }
});
