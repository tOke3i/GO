"use strict";
var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("browser-sync");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var csscomb = require("gulp-csscomb");
var html = require("gulp-rigger");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var csso = require("gulp-csso");
var image = require("gulp-image");
var minify = require("gulp-minify");

// sass task
gulp.task("style", function() {
	gulp.src("app/sass/style.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				browsers: ["last 4 versions"]
			}),
			mqpacker({
				sort: true
			})
		]))
		.pipe(csscomb())
		.pipe(gulp.dest("app/css"))
		.pipe(server.reload({
			stream: true
		}));
});

// html build task
gulp.task("html", function() {
	gulp.src("app/html/*.html")
		.pipe(html())
		.pipe(gulp.dest("app"))
		.pipe(server.reload({
			stream: true
		}));
});

// browser-sync task
gulp.task("serve", ["style", "html"], function() {
	server.init({
		server: "./app",
		notify: false,
		open: true,
		ui: false
	});

	gulp.watch("app/sass/**/*.{scss,sass}", ["style"]).on("change", server.reload);
	gulp.watch("app/html/**/*.*", ["html"]).on("change", server.reload);
	gulp.watch("app/js/*.js").on("change", server.reload);
});

// build task (start)
gulp.task("clean-dev", function() {
	return gulp.src("dev-build", {
			read: false
		})
		.pipe(clean());
});
gulp.task("clean-production", function() {
	return gulp.src("build", {
		read: false
	})
		.pipe(clean());
});

gulp.task("dev-build", ["clean-dev"], function() {
	gulp.src("app/*.html").pipe(gulp.dest("dev-build"));
	gulp.src("app/fonts/**/*.{woff,woff2,eot,ttf}").pipe(gulp.dest("dev-build/fonts"));
	gulp.src("app/img/**/*.{png,jpg,gif,svg}").pipe(gulp.dest("dev-build/img"));
	gulp.src("app/js/**/*.js").pipe(gulp.dest("dev-build/js"));
	gulp.src("app/css/**/*.css").pipe(gulp.dest("dev-build/css"));
});
gulp.task("production-build", ["clean-dev"], function() {
	gulp.src("app/*.html").pipe(gulp.dest("build"));
	gulp.src("app/fonts/**/*.{woff,woff2,eot,ttf}").pipe(gulp.dest("build/fonts"));
	gulp.src("app/img/**/*.{png,jpg,gif,svg}").pipe(gulp.dest("build/img"));
	gulp.src("app/js/**/*.js").pipe(gulp.dest("build/js"));
	gulp.src("app/css/**/*.css").pipe(gulp.dest("build/css"));
});

// minify files
gulp.task("style-min", function() {
	return gulp.src("app/css/*.css")
		.pipe(csso({
			restructure: true,
			sourceMap: true,
			debug: true
		}))
		.pipe(gulp.dest("build/css"));
});

gulp.task("img-min", function() {
	gulp.src("app/img/**/*")
		.pipe(image())
		.pipe(gulp.dest("build/img/"));
});

gulp.task("js-min", function() {
	gulp.src("app/js/*.js")
		.pipe(minify({
			ext: {
				min: ".min.js"
			},
		}))
		.pipe(gulp.dest("build/js"))
});

// Production-build task (final)
gulp.task("production", ["clean-production","production-build", "style-min", "img-min", "js-min"], function() {});
