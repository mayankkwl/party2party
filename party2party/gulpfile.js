var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
// var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
    images: './img/*',
    scripts: [

        // Libraries
        "./bower_components/d3/d3.js",
        "./bower_components/jquery/dist/jquery.min.js",
        "./bower_components/angular/angular.min.js",
        "./bower_components/angular-animate/angular-animate.min.js",
        "./bower_components/angular-aria/angular-aria.min.js",
        "./bower_components/angular-message/angular-message.min.js",
        "./bower_components/angular-route/angular-route.min.js",
        "./bower_components/angular-material/angular-material.js",
        // d3 file
        "./js/Graph/Graph.js",
        // Application files
        "./js/main.js",
        
        // Assets
        "./js/assets/**/*.js",
        
        // Controllers
        "./js/Controllers/*/*.js"
    ],
    style: [
        "./bower_components/angular-material/angular-material.css",
        "./bower_components/font-awesome-4.5.0/css/font-awesome.min.css",

        //Custom stylesheets
        "./style/screen.css",
    ],

    fonts: [
        "./bower_components/font-awesome-4.5.0/fonts/*"
    ],
    views: [
        "./views/*"
    ],
    index: "./index.html"


};
var dest = {
    images: "build/img/",
    scripts: "build/js/",
    style: "build/css/",
    fonts: "build/fonts/",
    views: "build/views/",
    index: "build/"
}


gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        // .pipe(sourcemaps.init())
        // .pipe(uglify())
        .pipe(concat('all.min.js'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.scripts));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(dest.images));
});

gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(dest.fonts));
});

gulp.task('views', function() {
    return gulp.src(paths.views)
        .pipe(gulp.dest(dest.views));
});

gulp.task('index', function() {
    return gulp.src(paths.index)
        .pipe(gulp.dest(dest.index));
});

gulp.task('css', function() {
    return gulp.src(paths.style)
        .pipe(minify())
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest(dest.style));
})
// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.fonts, ['fonts']);
    gulp.watch(paths.views, ['views']);
    gulp.watch(paths.index, ['index']);
    gulp.watch(paths.style, ['css']);
});

gulp.task('default', ['watch', 'scripts', 'images', 'fonts', 'views', 'index', 'css']);