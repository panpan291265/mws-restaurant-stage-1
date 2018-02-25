const gulp = require('gulp');
const del = require('del');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const imageMin = require('gulp-imagemin');
const responsive = require('gulp-responsive');
const runSequence = require('run-sequence');
const pathSourceImages = `./img-src`;
const pathDestImages = `./img`;
const nodeModules = 'node_modules';


gulp.task('clean:images', function () {
	return del(`${pathDestImages}/**/*`);
});

gulp.task('copy:images:fixed', function () {
	return gulp.src(`${pathSourceImages}/*.ico`)
        .pipe(imageMin({ verbose: false }))
		.pipe(gulp.dest(`${pathDestImages}`));
});

gulp.task('copy:images:responsive', function () {
	return gulp.src(`${pathSourceImages}/**/*.jpg`)
        .pipe(responsive({
            '*.jpg': [
                {
                    width: 400,
                    quality: 50,
                    rename: { suffix: '-400'}
                },
                {
                    width: 600,
                    quality: 50,
                    rename: { suffix: '-600'}
                },
                {
                    width: 800,
                    quality: 50,
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
        'copy:images:fixed',
        'copy:images:responsive'
	);
});

gulp.task('build', function () {
	return runSequence(
		'build:images'
	);
});
