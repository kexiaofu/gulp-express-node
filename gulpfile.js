// 添加引用
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    nodemon = require('gulp-nodemon'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    oconcat = require('gulp-concat');
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
gulp.task('server', ["node"], function() {
    var files = ['views/**/*.html', 'views/**/*.js', 'views/**/*.jade', 'public/**/*.*'];
    //gulp.run(["node"]);
    browserSync.init(files, {
        proxy: 'http://localhost:3000',
        browser: 'chrome',
        notify: true,
        port: 4001
    });
    gulp.watch('public/pagesass/**/*.scss', ['sassfile'])
        //gulp.watch('public/pagecss/*.css', ['cssmin'])
    gulp.watch(files).on("change", reload);
});
//css压缩合并
gulp.task('cssmin', function() {
        return gulp.src('public/pagecss/*.css').pipe(plumber({
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
            .pipe(gulp.dest('public/stylesheets/')); //输出文件夹
    })
    //sass配置
    //pipe(cssmin())css压缩
gulp.task('sassfile', function() {
    return gulp.src('public/pagesass/**/*.scss').pipe(plumber({
        errorHandler: function(err) {
            // display the error message
            console.log(err);
            // end the errored task
            this.emit('end')
        }
    })).pipe(sass()).pipe(cssmin()).pipe(rename({
        suffix: '.min'
    })).pipe(gulp.dest('public/stylesheets/'));
});