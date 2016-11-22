// 添加引用
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    nodemon = require('gulp-nodemon'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    oconcat = require('gulp-concat'),
    babel = require("gulp-babel"),
    jsSrc = 'src/public/js/**/*.js',
    sassSrc = 'src/public/sass/**/*.scss',
    cssDistSrc = 'dist/public/css/';
jsDistSrc = 'dist/public/js/';
//这个可以让express启动
gulp.task("node", function() {
    nodemon({
        script: './bin/www',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
});
gulp.task('server', function() {
    gulp.watch(sassSrc, ['sassfile'])
    gulp.watch(jsSrc, ['jsmin'])
        //gulp.watch('src/public/pagecss/*.css', ['cssmin'])
});

gulp.task('dev', ["node"], function() {
    var files = ['src/views/**/*.jade', 'src/public/**/*.*'];
    gulp.run(["node"]);
    browserSync.init(files, {
        proxy: 'http://localhost:3000',
        browser: 'chrome',
        notify: false,
        port: 4001
    });
    gulp.watch(sassSrc, ['sassfile'])
    gulp.watch(jsSrc, ['es6Toes5'])
        //gulp.watch('src/public/pagecss/*.css', ['cssmin'])
    gulp.watch(files).on("change", reload);
});
//css压缩合并
gulp.task('cssmin', function() {
        return gulp.src('src/public/css/*.css').pipe(plumber({
                errorHandler: function(err) {
                    // display the error message
                    console.log(err);
                    // end the errored task
                    this.emit('end')
                }
            }))
            //.pipe(oconcat('style.css'))//开启合并
            .pipe(rename({
                suffix: '.min'
            })) //rename压缩后的文件名
            .pipe(cssmin()) //执行压缩
            .pipe(gulp.dest(cssDistSrc)); //输出文件夹
    })
    //sass配置
    //pipe(cssmin())css压缩
gulp.task('sassfile', function() {
    return gulp.src(sassSrc).pipe(plumber({
        errorHandler: function(err) {
            // display the error message
            console.log(err);
            // end the errored task
            this.emit('end')
        }
    })).pipe(sass()).pipe(cssmin()).pipe(rename({
        suffix: '.min'
    })).pipe(gulp.dest(cssDistSrc));
});
gulp.task('jsmin', function() {
    return gulp.src(jsSrc).pipe(babel({
        presets: ['es2015']
    })).pipe(plumber({
        errorHandler: function(err) {
            // display the error message
            console.log(err);
            // end the errored task
            this.emit('end')
        }
    })).pipe(uglify()).pipe(rename({
        suffix: '.min'
    })).pipe(gulp.dest(jsDistSrc))
})

gulp.task('es6Toes5',function(){
    return gulp.src(jsSrc).pipe(babel({
        presets: ['es2015']
    })).pipe(plumber({
        errorHandler: function(err) {
            // display the error message
            console.log(err);
            // end the errored task
            this.emit('end')
        }
    })).pipe(rename({
        suffix: '.min'
    })).pipe(gulp.dest(jsDistSrc))
})