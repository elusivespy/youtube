var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');

function swallowError (error) {
  console.log(error.toString());
  this.emit('end')
}
gulp.task("default", function () {
    return browserify({
        basedir: './src',
        debug: true,
        entries: ['main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
	.on('error', swallowError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist")); 
});

gulp.task('watch', function() {
  watch('src/*.ts', function() {
    gulp.run(['default']);
  })	
});