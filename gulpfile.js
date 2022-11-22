const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function scss() {
    return gulp
        .src('**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./'))
}

let build = gulp.series(scss);

exports.build = build;