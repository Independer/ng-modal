/* eslint-disable */
const gulp = require('gulp'),
  path = require('path'),
  del = require('del'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  inline_base64 = require('./tools/gulp/inline-base64'),
  autoprefixer = require('gulp-autoprefixer'),
  es = require('event-stream');

const { readdirSync } = require('fs')

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'projects', 'ng-modal', 'src');
const themesSrcFolder = path.join(srcFolder, 'lib', 'themes');
const distFolder = path.join(rootFolder, 'dist', 'ng-modal');
const schematicsDistFolder = path.join(distFolder, 'schematics');
const themesDistFolder = path.join(distFolder, 'themes');

const themes = readdirSync(themesSrcFolder);

gulp.task('compile:themes', function() {
  return es.merge(themes.map(theme => {
    return gulp.src([`${themesSrcFolder}/${theme}/*.scss`])
      .pipe(sass().on('error', sass.logError))
      .pipe(inline_base64({
        baseDir: `${themesSrcFolder}/${theme}`
      }))
      .pipe(autoprefixer("last 2 version", "> 1%", {
        cascade: true
      }))
      .pipe(gulp.dest(`${themesDistFolder}/${theme}`));
  }));
});

gulp.task('copy:themes-src', function() {
  return es.merge(themes.map(theme => {
    return gulp.src([`${themesSrcFolder}/${theme}/*.scss`, `${themesSrcFolder}/${theme}/assets/**/*.*`], {base: `${themesSrcFolder}/${theme}`})
      .pipe(gulp.dest(`${themesDistFolder}/${theme}/src`));
  }));

});

gulp.task('copy:schematics:assets', function() {
  return gulp.src(
    [
      './projects/ng-modal/schematics/*/schema.json',
      './projects/ng-modal/schematics/*/files/**',
      './projects/ng-modal/schematics/collection.json'
    ],
    { base: './projects/ng-modal/schematics' }
  )
  .pipe(gulp.dest(schematicsDistFolder));

});

gulp.task('clean:themes', function () {
  return deleteFolders([themesDistFolder]);
});

gulp.task('compile', function () {
  runSequence(
    'compile:themes',
    'copy:themes-src',
    function (err) {
      if (err) {
        console.log('ERROR:', err.message);
        deleteFolders([distFolder, tmpFolder, buildFolder]);
      } else {
        console.log('Compilation finished succesfully');
      }
    });
});

gulp.task('clean', ['clean:themes']);
gulp.task('build', ['clean', 'compile']);
gulp.task('default', ['build']);

function deleteFolders(folders) {
  return del(folders);
}
