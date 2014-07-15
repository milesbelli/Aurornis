/* relativeTime will display the time relative to how long ago the given time
 *  was from the current time. We will display rounded down to the largest
 *  unit, so 90 minutes = 1h, 10 days = 1w, 6 weeks = 1 mo. Maybe I'll even
 *  pluralize if I feel like it, but I probably won't and really, this is meant
 *  to be as short as possible to save character space.
 */

var secondsInA = {
		minute: 60,
		hour: 3600,
		day: 86400,
		week: 604800,
		month: 2592000,
		year: 31536000
};

var relativeTime;

if (relativeTime == null) relativeTime = {};

relativeTime.simple = function(date){
	
	date = Math.floor(Date.parse(date) / 1000);
	var passed = requestParam.timeStamp() - date;
	
	var output;
	
	if (passed < secondsInA.minute) output = passed + "s";
	else if (passed < secondsInA.hour) output = Math.floor(passed / secondsInA.minute) + "m";
	else if (passed < secondsInA.day) output = Math.floor(passed / secondsInA.hour) + "h";
	else if (passed < secondsInA.week) output = Math.floor(passed / secondsInA.day) + "d";
	else if (passed < secondsInA.month) output = Math.floor(passed / secondsInA.week) + "w";
	else if (passed < secondsInA.year) output = Math.floor(passed / secondsInA.month) + "mo";
	else output = Math.floor(passed / secondsInA.year) + "y";
	
	return output;
}