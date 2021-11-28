import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import browsersync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import changedInPlace from 'gulp-changed-in-place';
import del from 'del';
// import eslint from 'gulp-eslint';
// import stylelint from 'gulp-stylelint';
import ifElse from 'gulp-if-else';
import minimist from 'minimist';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
// import webpack from 'webpack';
// import webpackStream from 'webpack-stream';

// defining base paths
const basePaths = {
  node: './node_modules/'
};

// update localPath variable to destination of local webserver
const localPath = 'http://localhost:1337';
// const webpackDevConfig = require('./webpack.config.js');
// const webpackProdConfig = require('./webpack.prod.config.js');

const argv = minimist(process.argv.slice(2));

const config = {
  dest: '/',
  production: argv.production
  // webpackConfig: argv.production ? webpackProdConfig : webpackDevConfig
};

const browserSync = (done) => {
  browsersync.init({
    proxy: localPath
  });
  done();
};

const browserSyncReload = (done) => {
  browsersync.reload();
  done();
};

// Delete build directory
export const clean = () => del(['./css/*', './js/*']);

// Copy static assets to build directory
export const copyAssets = (done) => {
  // Copy all Font Awesome Fonts
  // gulp.src('./node_modules/font-awesome/fonts/*.{ttf,woff,woff2,eof,svg}')
  //   .pipe(gulp.dest('./fonts'));

  // gulp.src(`${basePaths.node}slick-carousel/slick/ajax-loader.gif`)
  //   .pipe(gulp.dest('./images'));

  // gulp.src(`${basePaths.node}slick-carousel/slick/fonts/*.{ttf,woff,woff2,eot,svg}`)
  //   .pipe(gulp.dest('./fonts'));

  // gulp.src('./src/js/directory-map/data.json')
  //   .pipe(gulp.dest('./js'));

    gulp.src(`fonts/*.{ttf,woff,woff2,eot,svg}`)
    .pipe(gulp.dest('./public/fonts'));

  done();
};

export const css = () => {
  const options = {
    includePaths: [
      './node_modules/tachyons-sass',
      './node_modules/font-awesome/scss'
      // './node_modules/slick-carousel/slick',
      // './node_modules/flickity/css'
    ]
  };

  return gulp.src(['./src/sass/*.scss', './src/sass/**/.scss'])
    .pipe(ifElse(config.production, () => rename({ suffix: '.min' })))
    .pipe(sass(options))
    .pipe(autoprefixer({
      cascade: false,
      grid: 'no-autoplace'
    }))
    .pipe(ifElse(config.production, () => cleanCSS()))
    .pipe(gulp.dest('./public/css'))
    .pipe(browsersync.stream());
};

const cssLint = () => (
  gulp.src([
    './src/sass/*.scss',
    './src/sass/**/*.scss',
    './src/sass/**/**/*.scss'
  ], { base: './src/sass/' })
    .pipe(changedInPlace())
    // .pipe(stylelint({
    //   reporters: [{
    //     formatter: 'string',
    //     console: true
    //   }],
    //   failAfterError: false
    // }))
);

export const cssLintAll = () => (
  gulp.src([
    './src/sass/*.scss',
    './src/sass/**/*.scss',
    './src/sass/**/**/*.scss'
  ], { base: './src/sass/' })
    // .pipe(stylelint({
    //   fix: argv.fix,
    //   reporters: [{
    //     formatter: 'string',
    //     console: true
    //   }],
    //   failAfterError: false
    // }))
    .pipe(gulp.dest('./src/sass/'))
);

// export const js = () => (
//   webpackStream(config.webpackConfig, webpack)
//     .on('error', notify.onError((error) => {
//       this.emit('end');
//       return `Error: ${error.message}`;
//     }))
//     .pipe(gulp.dest('./js'))
// );

// function isFixed(file) {
//   // Has ESLint fixed the file contents?
//   // return file.eslint != null && file.eslint.fixed;
// }

// // Lint task for changed files
// const jsLint = () => (
//   gulp.src([
//     './src/js/*.js',
//     './src/js/**/*.js',
//     './src/js/**/**/*.js'
//   ], { base: './src/js/' })
//     .pipe(changedInPlace())
//     .pipe(eslint())
//     .pipe(eslint.format())
// );

// // Lint all js files
// export const jsLintAll = () => (
//   gulp.src([
//     './src/js/*.js',
//     './src/js/**/*.js',
//     './src/js/**/**/*.js'
//   ], { base: './src/js/' })
//     .pipe(eslint({
//       fix: argv.fix
//     }))
//     .pipe(eslint.format())
//     .pipe(ifElse(isFixed, () => gulp.dest('./src/js/')))
// );

// Watch files and recompile when changes are detected
export const watchFiles = () => {
  // gulp.watch([
  //   './src/js/*.js',
  //   './src/js/**/*.(js|json)',
  //   './src/js/**/**/*.js'
  // ], gulp.parallel(jsLint, js));

  gulp.watch([
    './src/sass/*.scss',
    './src/sass/**/*.scss'
  ], gulp.parallel(cssLint, css));

  // gulp.watch([
  //   './js/*.js',
  //   './*.php',
  //   './partials/*.php',
  //   './templates/*.php'
  // ], browserSyncReload);

  // gulp.watch([
  //   './js/*.js'
  // ], browserSyncReload);
};

// define complex tasks

// Lint all css and js files
// add --fix argument to autofix eligible errors
// export const lintAll = gulp.parallel(cssLintAll, jsLintAll);
export const lintAll = gulp.parallel(cssLintAll);

// Builds production package
// (most likely run with argument --production)
// export const deploy = gulp.series(clean, gulp.parallel(copyAssets, css, js));
export const deploy = gulp.series(clean, gulp.parallel(copyAssets, css));

// Builds development package
export const build = gulp.parallel(copyAssets,
  // gulp.series(cssLintAll, css), gulp.series(jsLintAll, js));
  gulp.series(cssLintAll, css));

// Builds production package
// Watches files and recompiles when changes are detected
export const watch = gulp.series(gulp.parallel(browserSync, build), watchFiles);

export default build;
