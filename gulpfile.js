const gulp = require("gulp");
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

// copy bundles/model/dist/model.js to public/main.js
gulp.task('html-mainjs', gulp.series(function () {
    return gulp.src('bundles/html/dist/html.js')
        .pipe(plumber())
        .pipe(rename('main.js'))
        .pipe(gulp.dest('bundles/html/public/'))
        .pipe(browserSync.reload({ stream: true }));
}));

gulp.task("serve", gulp.series('html-mainjs', function () {
    browserSync.init({
        server: "bundles/html/public"
    });
    gulp.watch("bundles/html/dist/html.js", gulp.series('html-mainjs'));
}));

gulp.task("default", gulp.series('serve'));
