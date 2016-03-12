/*eslint-disable */
var gulp = require('gulp');
var docco = require('gulp-docco');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('docs', function() {
  gulp.src('./lib/**/*.js', {base: '.'})
  .pipe(docco())
  .pipe(gulp.dest('./docs'));
});
