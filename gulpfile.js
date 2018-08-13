const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename')
const gutil = require('gulp-util')
gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
});

gulp.task('watch', function () {
    gulp.watch('./public/sass/*.scss', ['sass']);
});

gulp.task('js', function () {
    return gulp.src('Client/javascript/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/jsClient'))
});
const jsSRC = 'script.js';
const jsFolder = 'gulpTest/';
const jsFILES = [jsSRC];


gulp.task('jsES6', function () {
    jsFILES.map((entry) => {
        return browserify({
            entries: [jsFolder + entry]
        })
            .transform(babelify, { presets: ['env'] })
            .bundle()
            .pipe(
                source(entry)
            )
            .pipe(
                rename(
                    {
                        extname: '.min.js'
                    }
                )
            )
            .pipe(
                buffer()
            )
            .pipe(
                sourcemaps.init({ loadMaps: true })
            )
            .pipe(
                uglify()
            )
            .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
            .pipe(
                sourcemaps.write('./')
            )
            .pipe(gulp.dest('public/jsClient'))
    });
    // browserify
    // Transform babelify
    //bundle
    //source
    //rename
    //buffer
    //init sorucemap
    //uglify
    //write sourcemape
});

gulp.task('default', ['sass', 'watch', 'js'])