calendarUI.controller("dayEvents", ['$scope', 'eventService', 'calendarOrganizerService', function($scope, eventService, calendarOrganizerService) {
    // need correction!
	$scope.events = eventService.getEvents();
	
	calendarOrganizerService.organize($scope.events);
	
	/*
	 * Configure Grid layout for showing events in the day
	 */
	$scope.grid = {
		getMaxColumnNumber: function() {
			var maxColumn = 0;
			for(var i = 0; i < $scope.events.length; i++)	{
				var event = $scope.events[i];
				if(event.column > maxColumn) {
					maxColumn = event.column;
				}
			}
			return maxColumn;
		},
		fillColumns: function() {
			var columns = $scope.grid.getMaxColumnNumber($scope.events);
			return "repeat(" + columns + ", auto)";
		},
		
		fillRows: function() {
			var gridrow = "";
			for (var hour = 0, midhour = 30; hour < 24; hour++) {
				gridrow += "[h" + hour + "-0] 2fr [h" + hour + "-" + midhour + "] 1fr ";
			}
			return gridrow;
		},
	};
	
	$scope.showHours = function() {
		
	};
	
	$scope.dayView = {
		gridrow: "",
		hours: []
	};	
	for(var hour = 0; hour < 24; hour++){
		$scope.dayView.hours.push("[h" + hour + "-0]");
		//$scope.dayView.hours.push("[h" + hour + "-30]");
		$scope.dayView.gridrow += "[h" + hour + "-0] 2fr";
	}
}]);