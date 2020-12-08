'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')

const paths = {
  APPLICATION_SCSS: './application.scss',
  COMPONENT_SCSS: './src/**/*.scss'
}

gulp.task('sass', done => {
  gulp
    .src([paths.APPLICATION_SCSS, paths.COMPONENT_SCSS])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('application.css'))
    .pipe(gulp.dest('./public/build/stylesheets'))
  done()
})

gulp.task('sass:watch', () => {
  gulp.watch([paths.APPLICATION_SCSS, paths.COMPONENT_SCSS], ['sass'])
})
