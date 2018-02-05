import TrackerExtractor from "./Trackers/TrackerExtractor.js";
import SourceExtractor from "./Trackers/SourceExtractor.js";
import * as Actions from "glob:./actions/*.js";


global.MAX_GRAPH_POINTS = 2000;

@Service
class TrackerService
{
	static TrackerExtractor = TrackerExtractor;
	static SourceExtractor = SourceExtractor;
	
	static validateTracker(tracker)
	{
		tracker.soour
	}

	static validateSource(source)
	{
		// if(source.actions)	
	}

	getActionNames()
	{
		return Object.keys(Actions);
	}
};
