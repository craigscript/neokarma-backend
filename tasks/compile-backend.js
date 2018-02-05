var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var minifyejs = require('gulp-minify-ejs');

// Babel
var babel = require("gulp-babel");

// Import live reload
var livereload = require("gulp-livereload");


gulp.task("compile-backend", function(done)
{
	runSequence("cleanup", "compile-backend:config", "compile-backend:source", "compile-backend:views", "compile-backend:storage", "compile-backend:json", done);
})

gulp.task("compile-backend:config", function ()
{
	return gulp.src(['source/config/**/*']).pipe(gulp.dest('build/server/config/'));
});

gulp.task("compile-backend:source", function (done)
{
	gutil.log(gutil.colors.magenta("Compiling Backend"));
	
	BabelCompile([
		{
			source: "source/Boot.js",
			dest: "build/server/"
		},
		{
			source: "source/controllers/**/**.js",
			dest: "build/server/controllers/"
		},
		{
			source: "source/models/**/**.js",
			dest: "build/server/models/"
		},
		{
			source: "source/policies/**/**.js",
			dest: "build/server/policies/"
		},
		{
			source: "source/responses/**/**.js",
			dest: "build/server/responses/"
		},
		{
			source: "source/services/**/**.js",
			dest: "build/server/services/"
		},
		{
			source: "source/utils/**/**.js",
			dest: "build/server/utils/"
		},
		{
			source: "source/thirdparty/**/**.js",
			dest: "build/server/thirdparty/"
		},
	], done);

});

gulp.task("compile-backend:views", function (done)
{
	gutil.log(gutil.colors.magenta("Copying Views"));
	return gulp.src(['source/views/**/*']).pipe(gulp.dest('build/views/')).pipe(livereload());
});

gulp.task("compile-backend:json", function (done)
{
	gutil.log(gutil.colors.magenta("Copying JSON"));
	return gulp.src(['source/**/**.json']).pipe(gulp.dest('build/server/'))
});

gulp.task("compile-backend:storage", function (done)
{
	gutil.log(gutil.colors.magenta("Copying Storage"));
	return gulp.src(['source/storage/**/*']).pipe(gulp.dest('build/storage/'));
});

/* Custom babel compiler sequence script */
function BabelSource(source, dest, done)
{
	gutil.log(gutil.colors.magenta(source), gutil.colors.cyan(" =>"), gutil.colors.magenta(dest));
	gulp.src(source)
	.pipe(babel())
	.on('error', function(error, callback)
	{
		gutil.log(gutil.colors.red("[Babel-Transpiler] Backend Error:"), error.stack);
		this.emit("end");
		return Promise.resolve();
	})
	.pipe(gulp.dest(dest))
	.on("end", done);
}

function BabelCompile(files = [],  done)
{
	var next = function() 
	{
		if(!files.length)
		{
			done();
			return;
		}

		var file = files.shift();
		
		BabelSource(file.source, file.dest, next);
	};
	next();
}