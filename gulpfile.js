var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	jade = require('gulp-jade'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'), 
    pngquant = require('imagemin-pngquant');

gulp.task('jade', function() {
	gulp.src('app/templates/pages/*.jade')
		.pipe(jade({
			pretty: '\t',
	}))
	.pipe(gulp.dest('app/'))
});
gulp.task('sass', function(){
	return gulp.src('app/sass/*.+(scss|sass)')
	// return gulp.src('app/sass/custom.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});
gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/custom.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
});
gulp.task('watch', ['browser-sync', 'sass'], function() {
	gulp.watch('app/sass/*.+(scss|sass)', ['sass']);
	gulp.watch('app/templates/**/*.jade', ['jade']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass'], function() {
	var buildCss = gulp.src([
		'app/css/*.css',
		''
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'))
});