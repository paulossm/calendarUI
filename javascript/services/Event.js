calendarUI.factory('eventService', function() {
	/*
	 * 
	 * Provides structure for creating events for the calendar.
	 *
	 */
	function Event(color, start, end) {
		this.color = color;
		this.startTime = start;
		this.endTime = end;
	}
	
	var events = [];
	var initializeEvents = function() {
		/*
		 * Creates default events for filling the calendar day
		 */
		events.push(new Event("blue", new Date("2017-10-13T09:00:00"), new Date("2017-10-13T15:30:00")));
		events.push(new Event("green", new Date("2017-10-13T09:00:00"), new Date("2017-10-13T14:30:00")));
		events.push(new Event("brown", new Date("2017-10-13T09:30:00"), new Date("2017-10-13T11:30:00")));
		events.push(new Event("red", new Date("2017-10-13T11:30:00"), new Date("2017-10-13T12:30:00")));
		events.push(new Event("orange", new Date("2017-10-13T14:30:00"), new Date("2017-10-13T15:00:00")));
		events.push(new Event("yellow", new Date("2017-10-13T15:30:00"), new Date("2017-10-13T16:00:00")));
	};
	
	initializeEvents();
	
	return {
		getEvents: function() {
			return events;
		},
		createEvent: function(color, start, end) {
			return new Event(color, start, end);
		}
	}
});