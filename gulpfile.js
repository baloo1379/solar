let gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    del = require('del'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    htmlreplace = require('gulp-html-replace');

let source = {
    sass: 'src/sass/*.scss',
    css: 'src/css',
    js: 'src/js/*.js',
    images: 'src/images/*'

};

let dist = {
    css: 'dist/css',
    js: 'dist/js',
    images: 'dist/images'
};

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
    })
});

gulp.task('sass', () => {
    return gulp.src(source.sass)
        //.pipe(concat('all.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(source.css))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('watch', ['browserSync', 'sass'], ()=>{
    gulp.watch(source.sass, ['sass'])
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('production:html', () => {
    return gulp.src('src/index.html')
        .pipe(htmlreplace({
            'css': 'css/style.min.css',
            'bulma': 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('production:sass', () => {
    return gulp.src(source.sass)
        .pipe(concat('all.scss'))
        .pipe(autoprefixer())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({
            basename: 'style',
            suffix: '.min',
            extname: ".css"
        }))
        .pipe(gulp.dest(dist.css))
});

gulp.task('production:copy', ()=>{
    return gulp.src(source.images)
        .pipe(gulp.dest(dist.images))
});

gulp.task('production', ['production:sass', 'production:html', 'production:copy'], () => {

});