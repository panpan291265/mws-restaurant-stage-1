const gulp = require('gulp');
const del = require('del');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const imageMin = require('gulp-imagemin');
const responsive = require('gulp-responsive');
const minifyCss = require('gulp-clean-css');
const minifyJs = require('gulp-uglify-es').default;
const runSequence = require('run-sequence');
const pathSourceImages = './img-src';
const pathDestImages = './img';
const pathCss = './css';
const pathJs = './js';
const nodeModules = 'node_modules';


/* images */

gulp.task('clean:images', function () {
	return del(`${pathDestImages}/**/*`);
});

gulp.task('copy:images:app', function () {
    return gulp.src([
            `${pathSourceImages}/restaurant.png`
        ])
        .pipe(responsive({
            '*.png': [
                {
                    width: 128,
                    quality: 33,
                    rename: { suffix: '-128'}
                },
                {
                    width: 256,
                    quality: 33,
                    rename: { suffix: '-256'}
                },
                {
                    width: 512,
                    quality: 33,
                    rename: { suffix: '-512'}
                },
                {
                    width: 720,
                    quality: 33,
                    rename: { suffix: ''}
                }
            ]
        }))
        .pipe(imageMin({ verbose: false }))
		.pipe(gulp.dest(`${pathDestImages}`));
});

gulp.task('copy:images:data', function () {
	return gulp.src(`${pathSourceImages}/**/*.jpg`)
        .pipe(responsive({
            '*.jpg': [
                {
                    width: 200,
                    quality: 33,
                    rename: { suffix: '-200'}
                },
                {
                    width: 300,
                    quality: 33,
                    rename: { suffix: '-300'}
                },
                {
                    width: 400,
                    quality: 33,
                    rename: { suffix: '-400'}
                },
                {
                    width: 500,
                    quality: 33,
                    rename: { suffix: '-500'}
                },
                {
                    width: 600,
                    quality: 33,
                    rename: { suffix: '-600'}
                },
                {
                    width: 800,
                    quality: 33,
                    rename: { suffix: ''}
                }
            ]
        }))
        .pipe(imageMin({ verbose: false }))
		.pipe(gulp.dest(`${pathDestImages}`));
});

gulp.task('build:images', function () {
	return runSequence(
        'clean:images',
        'copy:images:app',
        'copy:images:data'
	);
});


/* css */

gulp.task('clean:css', function () {
	return del(`${pathCss}/*.min.css`);
});

gulp.task('minify:css', function () {
	return gulp.src([pathCss + '/*.css', !pathCss + '/*.min.css'])
		.pipe(minifyCss())
		.pipe(rename(function (path) {
			path.extname = '.min.css';
		}))
		.pipe(gulp.dest(pathCss));
});

gulp.task('build:css', function () {
	return runSequence(
        'clean:css',
        'minify:css'
	);
});


/* js */

gulp.task('clean:js', function () {
	return del(`${pathJs}/*.min.js`);
});

gulp.task('minify:js', function () {
	return gulp.src([pathJs + '/*.js', !pathJs + '/*.min.js'])
        .pipe(minifyJs())
		.pipe(rename(function (path) {
			path.extname = '.min.js';
		}))
		.pipe(gulp.dest(pathJs));
});

gulp.task('build:js', function () {
	return runSequence(
        'clean:js',
        'minify:js'
	);
});


/* serviceWorker */

gulp.task('clean:serviceWorker', function () {
	return del('serviceWorker.min.js');
});

gulp.task('minify:serviceWorker', function () {
	return gulp.src('serviceWorker.js')
        .pipe(minifyJs())
		.pipe(rename(function (path) {
			path.extname = '.min.js';
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('build:serviceWorker', function () {
	return runSequence(
        'clean:serviceWorker',
        'minify:serviceWorker'
	);
});


/* main build tasks */

gulp.task('clean', function () {
	return runSequence(
        'clean:images',
        'clean:css',
        'clean:js',
        'clean:serviceWorker'
	);
});

gulp.task('build', function () {
	return runSequence(
        'build:images',
        'build:css',
        'build:js',
        'build:serviceWorker'
	);
});
