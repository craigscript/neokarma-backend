// Gulp Stuff
var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Watch
gulp.task('watch', function()
{
	// Backend Watch
	gulp.watch('source/Boot.js', ["compile-backend-withrestart"]);
	gulp.watch('source/models/**/*', ["compile-backend-withrestart"]);
	gulp.watch('source/policies/**/*', ["compile-backend-withrestart"]);
	gulp.watch('source/responses/**/*', ["compile-backend-withrestart"]);
	gulp.watch('source/controllers/**/*', ["compile-backend-withrestart"]);
	gulp.watch('source/services/**/*', ["compile-backend-withrestart"]);
	gulp.watch('source/utils/**/*', ["compile-backend-withrestart"]);
	gulp.watch('source/thirdparty/**/*', ["compile-backend-withrestart"]);

	// Backend Config
	gulp.watch('source/config/**/*', ["compile-backend:config", "start-server"]);

	// Backend Views
	gulp.watch('source/views/**/*', ["compile-backend:views"]);
	gulp.watch('source/storage/**/*', ["compile-backend:storage"]);

	gutil.log(gutil.colors.green("Watches are running"));

	return Promise.resolve();
});

gulp.task("compile-backend-withrestart", function(done)
{
	runSequence("compile-backend:source", "compile-backend:views", "compile-backend:storage", "compile-backend:json", "start-server", done);
})

gulp.task("watch:server", function(done)
{
	runSequence("compile", "start-server", done);
})