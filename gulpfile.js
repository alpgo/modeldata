const gulp = require("gulp");
const exec = require('child_process').exec;
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task("build", function (done) {
    exec('npm run build', function (err) {
        done();
    });
});

gulp.task('html-mainjs', gulp.series(function () {
    return gulp.src('bundles/html/dist/html.js')
        .pipe(plumber())
        .pipe(rename('main.js'))
        .pipe(gulp.dest('bundles/html/public/'))
        .pipe(browserSync.reload({ stream: true }));
}));

gulp.task('laya-mainjs', gulp.series(function () {
    return gulp.src('bundles/laya/dist/laya.js')
        .pipe(plumber())
        .pipe(rename('main.js'))
        .pipe(gulp.dest('bundles/laya/public/'))
        .pipe(browserSync.reload({ stream: true }));
}));

gulp.task("serve", gulp.series("build", 'html-mainjs', 'laya-mainjs', function () {
    browserSync.init({
        server: "bundles/"
    });
    gulp.watch("bundles/html/dist/html.js", gulp.series('html-mainjs'));
    gulp.watch("bundles/laya/dist/laya.js", gulp.series('laya-mainjs'));
}));

gulp.task("default", gulp.series('serve'));
