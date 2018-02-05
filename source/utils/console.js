import colors from "colors";
global.colors = colors;
var log = console.log;
console.log = function()
{
	var date = new Date;
	var seconds = date.getSeconds();
	var minutes = date.getMinutes();
	var hours = date.getHours();
	Array.prototype.unshift.call(arguments, '['+hours+':'+minutes+':'+seconds+']');
	log.apply(this, arguments)
}