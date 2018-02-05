import * as TrackerTypes from "glob:./Trackers/*.js";
export default class TrackerManager
{
	constructor()
	{
		console.log("Tracker types: ready:", TrackerTypes);
	}
}