var gulp          = require('gulp');
var del           = require('del');
var cssmin        = require('gulp-clean-css');
var gnf           = require('gulp-npm-files');
var dependencies  = require('gulp-web-dependencies');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var sourcemaps    = require('gulp-sourcemaps');
var webserver     = require('gulp-webserver');

// Delete build folder
gulp.task('clean', function() {
	return del('build/');
});

// Compile SASS and minify
gulp.task('minify_css', function() {
    gulp.src('source/assets/css/*.css')
		.pipe(cssmin())
        .pipe(gulp.dest('build/assets/css/'));
});

// Task to copy dependencies in build folder (angular files)
gulp.task('copy_dependencies', function() {
    gulp.src('source/index.html')
        .pipe(dependencies({
            dest: 'build/',   
            prefix: '/assets/dependencies/',  
        }))
        .pipe(gulp.dest('build/'));
});

// Copy assets folder (exclude sass folder) in build folder
gulp.task('copy_assets', function() {
    gulp.src(['source/assets/**', '!source/assets/css', '!source/assets/css/**'])
        .pipe(gulp.dest('build/assets/'));
});

// Copy index file in build folder
gulp.task('copy_htaccess', function() {
    gulp.src('source/.htaccess')
        .pipe(gulp.dest('build/'));
});

// Task to copy project files in build folder
gulp.task('copy_project', ['copy_assets', 'copy_htaccess']);

// Concat, uglify and create sourcemap for application js files and move the final result (app.js) in build folder
gulp.task('prepare_js', function () {
	gulp.src(['source/app/app.js', 'source/app/coloripsum.js'])
		.pipe(sourcemaps.init())
			.pipe(concat('app.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/app/'))
});

// Task to prepare the build folder (basically runs every required action to create the final build)
gulp.task('prepare', ['copy_project', 'copy_dependencies', 'minify_css', 'prepare_js']);

// Task to watch any changes in src folder and refresh the build
gulp.task('watch', function() {
	gulp.watch(['source/**'], ['default']);
});

// Task to create a webserver (and the watcher) with livereload functionality
gulp.task('webserver', ['watch'], function() {
	gulp.src('build')
		.pipe(webserver({ livereload: true }));
});

// The default task cleans the build folder and prepares the project
gulp.task('default', ['clean'], function() { 
    gulp.start('prepare');
});