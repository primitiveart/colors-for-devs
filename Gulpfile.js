var gulp          = require('gulp');
var del           = require('del');
var cssmin        = require('gulp-clean-css');
var gnf           = require('gulp-npm-files');
var dependencies  = require('gulp-web-dependencies');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var sourcemaps    = require('gulp-sourcemaps');
var connect       = require('gulp-connect');
var gulpif        = require('gulp-if');
var workboxBuild  = require('workbox-build');

// Delete build folder
gulp.task('clean', function() {
	return del('build/');
});

// Copy static files such as assets and .htaccess in build folder
gulp.task('copy_static', function() {
    return gulp.src(['source/**', 'source/.*', '!source/sw.js', '!source/app/**', '!source/index.html'])
        // Minify CSS files
        .pipe(gulpif('assets/css/*.css', cssmin()))
        .pipe(gulp.dest('build/'));
});

// Copy dependencies in build folder (node_modules)
gulp.task('copy_dependencies', function() {
    return gulp.src('source/index.html')
        .pipe(dependencies({
            dest: 'build/',
            prefix: '/assets/dependencies/',
        }))
        .pipe(gulp.dest('build/'));
});

// Concat, uglify and create sourcemap for application js files and move the final result (app.js) in build folder
gulp.task('prepare_js', function () {
	return gulp.src(['source/app/app.js', 'source/app/coloripsum.js'])
        .pipe(concat('app.js'))
        .pipe(uglify())
		.pipe(gulp.dest('build/app/'))
        .pipe(connect.reload());
});

gulp.task('minify_dependencies', function() {
    return gulp.src(['build/assets/dependencies/**', '!build/assets/dependencies/**/*.min.*'])
        .pipe(gulpif('*.css', cssmin()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulp.dest('build/assets/dependencies/'));
});

// Generate the service worker
gulp.task('service_worker', function() {
    return workboxBuild.injectManifest({
        swSrc: 'source/sw.js',
        swDest: 'build/sw.js',
        globDirectory: 'build',
        globPatterns: [
          '**\/*.{js,json,css,html,png,ico,gif}',
        ]
    }).then(function({count, size, warnings}) {
        // Optionally, log any warnings and details.
        warnings.forEach(console.warn);
        console.log(count + ' files will be precached, totaling ' + size + ' bytes.');
    });
});

// Task to prepare the build folder (basically runs every required action to create the final build)
gulp.task('prepare', gulp.series(['copy_static', 'copy_dependencies', 'prepare_js', 'minify_dependencies', 'service_worker']));

// Task to watch any changes in src folder and refresh the build
gulp.task('watch', function() {
	return gulp.watch(['source/**'], gulp.series('default'));
});

// Task to create a webserver (and the watcher) with livereload functionality
gulp.task('connect', gulp.series(function(done) {
    connect.server({
        port: 8000,
        root: 'build',
        livereload: true,
				host: '0.0.0.0'
    });

    done();
}, 'watch'));

// The default task cleans the build folder and prepares the project
gulp.task('default', gulp.series(['clean', 'prepare']));
