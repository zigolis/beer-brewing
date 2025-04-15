/**
 * Beer Recipe Manager - Gulp Configuration
 * Build automation for SCSS compilation and JavaScript processing
 */

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const nodemon = require('nodemon');
const path = require('path');

// File paths
const paths = {
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'public/css'
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'public/js'
  },
  html: {
    src: 'views/**/*.ejs'
  }
};

// Compile SCSS to CSS with sourcemaps
function styles() {
  return src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

// Process JavaScript files
function scripts() {
  return src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Start nodemon server
function nodemonServer(cb) {
  let started = false;
  
  return nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['gulpfile.js', 'node_modules/', 'public/'],
    env: { 'NODE_ENV': 'development' }
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
}

// Configure BrowserSync
function browserSyncInit(cb) {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 3001,
    open: false,
    notify: false
  });
  cb();
}

// Reload browser
function browserSyncReload(cb) {
  browserSync.reload();
  cb();
}

// Watch files for changes
function watchFiles() {
  watch(paths.scss.src, styles);
  watch(paths.js.src, scripts);
  watch(paths.html.src, browserSyncReload);
  watch(['controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'utils/**/*.js'], browserSyncReload);
}

// Define complex tasks
const build = parallel(styles, scripts);
const dev = series(build, parallel(nodemonServer, browserSyncInit, watchFiles));

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.dev = dev;
exports.default = build;

