/*
 * Provides methods for laying out a calendar day
 */
calendarUI.factory('calendarOrganizerService', function() {
	
	var fillDay = function(events) {
		/*
		 * Append events to day by associating event times to day hours
		 */
		for(var index in events) {
			events[index].start = events[index].startTime.getTime();
			events[index].end = events[index].endTime.getTime();
			events[index].startRow = "h" + events[index].startTime.getHours() + "-" + events[index].startTime.getMinutes();
			events[index].endRow = "h" + events[index].endTime.getHours() + "-" + events[index].endTime.getMinutes();
			events[index].column = undefined;
			events[index].endColumn = undefined;
		}
	};
	
	var sortEventsByStartTime = function(events) {
		/*
		 * Sort events in order to respond to the most important rules:
		 * 1. The “earlier” the start time, the further left the event is positioned
		 * 2. The longer the duration of the event, the further left the event is positioned
		 */
		for (var index in events) {
			var event = events[index];
			var index2;
			for (
				index2 = index;
				index2 > 0 && (event.start < events[index2 - 1].start || (event.start == events[index2-1].start && event.end > events[index2-1].end)); index2--
				)
			{
					events[index2] = events[index2 - 1];
			}
			events[index2] = event;
		}
	};
	
	var collides = function(event, otherEvent) {
		/*
		 * TRUE: whether two events has colliding times
		 */
		if(event.start >= otherEvent.end || event.end <= otherEvent.start) {
			return false;
		}
		return true;
      }
	
	var groupCollidedEvents = function(events) {
		//Groups colliding events in list in order to better distribute positions	
		/** Code adapted from https://github.com/taterbase/calendar-puzzle **/
        var collisionGroups = [];
        collisionGroups[0] = [];
        collisionGroups[0].push(events[0]);

        // Each event starting from second event
        for (var index = 1, l = events.length; index < l; index++) {
			var event = events[index];

			// Collides with at least one existing collision group
			var found = false;

			// Each previous event or until found
			var index2 = index - 1;
			do {
				var previousEvent = events[index2];
				if (collides(event, previousEvent)) {
					/*
					 * Find the collision group that previous event belongs to
					 * and add current event's id to that collision group
					 */
					
					// Whether the previous event id has been found in a collision group
					var found2 = false;
					
					/* Count backwards since it is probably more likely that
					 * latest found collider is further on in the collision
					 * groups structure
					 */
					var index3 = collisionGroups.length;
					while (!found2 && index3-- > 0) {
						if (collisionGroups[index3].indexOf(previousEvent) != -1) {
							// Add current event to this collision group
							collisionGroups[index3].push(event);
							found2 = true;
						}
					}
					
					found = true;
				}
			} while (!found && index2-- > 0);

			// Did not collide with any other events so give it its own collision group
			if (!found) {
				collisionGroups.push([event]);
			}
		}
		
		/* check the possibility of expand event's width according to
		 * the positions and collisions around it
		 */
		for(var index4 = 0; index4 < collisionGroups.length; index4++) {
			var group = collisionGroups[index4];
			for(var index5 = 0; index5 < group.length; index5++) {
				event = group[index5];
				event.isSpandable = true;
				var index6 = index5;
				while(index6++ < group.length - 1) {
					if(collides(event, group[index6])) {
						event.isSpandable = false;
						break;
					}
				}
			}
		}
		
		return collisionGroups;
	}
	
	var positionEvents = function(eventGroups) {
		/*
		 * Define grid absolute placement to events
		 * according to the following rules:
		 * 1. Events must not overlap
		 * 2. The space must be used fully
		 */
		for(var index = 0; index < eventGroups.length; index++) {
			var group = eventGroups[index];
			
			var matrix = [];
				matrix[0] = [];
			
			// Each event in the collision group
			for (var index2 = 0; index2 < group.length; index2++) {
				var event = group[index2];
				var col = 0;
				var found = false;
				
				while(!found) {
					var row = getMatrixColumnLastRow(matrix, col);

					if (row === false) {
						// No last event in row and no index so create index and place here
						matrix[0].push(event);
						found = true;
					} else {
						var existingevent = matrix[row][col];
						if (!collides(event, existingevent)) {
							// Place the current event in the next row of the current column
							if (matrix[row + 1] === undefined) {
								matrix[row + 1] = [];
							}
							matrix[row + 1][col] = event;
							found = true;
						}
					}
					col++;
				}
			}
			
			// Set the column of all the events in the current matrix
			for (row = 0; row < matrix.length; ++row) {
				// sets the start position
				for (col = 0; col < matrix[row].length; ++col) {
					if(matrix[row][col]) {
						event = matrix[row][col];
						event.column = col + 1;	
						if(event.isSpandable) {
							event.spanWidth = true;
						}
					}
				}
			}
		}
	};
	
	var getMatrixColumnLastRow = function(matrix, col) {
		/* 
		 * From the last row in the matrix, search for the column where there
		 * is a value or until there are no more rows
		 */
		var row = matrix.length;
		while (row-- > 0) {
			if (matrix[row][col] !== undefined) {
				return row;
			}
		}

		// No more rows
		return false;
	}
	
	var organizeDay = function(events) {
		sortEventsByStartTime(events);
		var collideGroups = groupCollidedEvents(events);
		positionEvents(collideGroups);
	};
	
	return {
		organize: function(events) {
			fillDay(events);
			organizeDay(events);
		}
	}
});