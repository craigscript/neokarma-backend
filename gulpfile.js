var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Load Tasks
require("./tasks/compile-backend.js");
require("./tasks/start-server-process.js");
require("./tasks/watch.js");
require("./tasks/cleanup.js");
require("./tasks/deploy.js");

// Compile Backend & Frontend & Copy Assets
gulp.task("compile", function(done)
{
	runSequence("compile-backend",  done);
});

gulp.task("lift", function(done)
{
	runSequence("compile", 'watch', 'start-server', done);
});

gulp.task('help', function() {
	gutil.log(gutil.colors.cyan("Available Commands:"));
	gutil.log(gutil.colors.cyan("	- lift (Starts the webserver & watches without opening the browser)"));
	gutil.log(gutil.colors.cyan("	- compile (Compiles the frontend & backend files + copies the assets)"));
	gutil.log(gutil.colors.cyan("	- deploy --target <remote> --environment <env> (deploys to a target remote server with a target environment)"));
	gutil.log(gutil.colors.cyan("	- compile-backend (Compiles the backend files)"));
	gutil.log(gutil.colors.cyan("	- help (Displays the current help)"));
  return;
});

gulp.task('default', ["help"]);