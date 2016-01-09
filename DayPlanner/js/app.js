var app = angular.module('dayPlannerApp', []);

/**
 * Controller
 */
app.controller('EventsController', function ($scope, $location, EventsDataService) {
	$scope.events = null;
	$scope.selectedEvents = [];
	$scope.selectedEventsColumns = [];

	$scope.dayPlan = {
		size: 4,
		start: '9:00',
		end: '15:00'
	};

	EventsDataService.getEvents().then(function (data) {
		$scope.events = data;
	});

	//EventsDataService.getEventsFromHTML();

	$scope.toggleDayPlanSize = function(){
		$scope.dayPlan.size = $scope.dayPlan.size == 4 ? 12 : 4;
	};

	$scope.getTimetable = function(){
		var timetable = [];
		var end = Math.ceil($scope.timeToFloat($scope.dayPlan.end) / 100);
		var start = Math.floor($scope.timeToFloat($scope.dayPlan.start) / 100);
		var numberOfSlots = end - start + 1;
		console.log(numberOfSlots);

		for(var i = 0; i < numberOfSlots; i++) {
			var timeFloat = i + $scope.getStartTimeInt();
			timetable.push($scope.floatToTime(timeFloat));
		}

		return timetable;
	};

	$scope.selectEvent = function(event){
		$scope.selectedEvents.push(event);
		$scope.sortEventInCols(event);
	};

	$scope.sortEventInCols = function(event){
		var cols = $scope.selectedEventsColumns;
		if(cols.length == 0){
			cols.push([event]);
		} else {
			var colIndex = 0;
			while(colIndex < cols.length && $scope.colHasEventAtThisTime(cols[colIndex], event)){
				colIndex++;
			}
			if(colIndex >= cols.length){
				cols[colIndex] = [];
			}
			cols[colIndex].push(event);
		}
	};

	$scope.colHasEventAtThisTime = function(col, event){
		var eventTimeArray = event.time.split(' ');

		var eventStart = $scope.timeToFloat(eventTimeArray[0]);
		var eventDuration = event.duration * 100;
		var eventEnd = eventStart + eventDuration;

		/*
		console.log('-- ' + event.title + ' -----------------------');
		console.log('-- event start: ', eventStart);
		console.log('-- event duration: ', eventDuration);
		console.log('-- event end: ', eventEnd);
		*/

		for(var i = 0; i < col.length; i++){
			var colEvent = col[i];

			var colEventTimeArray = colEvent.time.split(' ');

			var colEventStart = $scope.timeToFloat(colEventTimeArray[0]);
			var colEventDuration = colEvent.duration * 100;
			var colEventEnd = colEventStart + colEventDuration;

			/*
			console.log('---- ' + colEvent.title + ' --------------------');
			console.log('---- col event start: ', colEventStart);
			console.log('---- col event duration: ', colEventDuration);
			console.log('---- col event end: ', colEventEnd);
			console.log('---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ');
			console.log('---- event starts after or at the same time as colEvent: ', eventStart >= colEventStart);
			console.log('---- event did not start after colEvent ended: ', eventStart < colEventEnd);
			console.log('---- event end before colEvent or at the same time: ', eventEnd <= colEventEnd);
			console.log('---- event did not end before colEvent even started: ', eventEnd > colEventStart);
			console.log('---- colEvent starts after or at the same time as event: ', colEventStart >= eventStart);
			console.log('---- colEvent did not start after event ended: ', colEventStart < eventEnd);
			console.log('---- colEvent end before event or at the same time: ', colEventEnd <= eventEnd);
			console.log('---- colEvent did not end before event even started: ', colEventEnd > eventStart);
			*/

			if( (eventStart >= colEventStart && eventStart < colEventEnd) ||
				(eventEnd <= colEventEnd && eventEnd > colEventStart) ||
				(colEventStart >= eventStart && colEventStart < eventEnd) ||
				(colEventEnd <= eventEnd && colEventEnd > eventStart)
			){
				return true;
			}

		}
		return false;
	};

	$scope.orderAllSelectedEvents = function(){
		$scope.selectedEventsColumns = [];
		for(var i = 0; i < $scope.selectedEvents.length; i++) {
			$scope.sortEventInCols($scope.selectedEvents[i]);
		}
	};

	$scope.deselectEventByIndex = function(index){
		var event = $scope.selectedEvents[index];
		for(var i = 0; i < $scope.selectedEventsColumns.length; i++){
			var col = $scope.selectedEventsColumns[i];
			if(col.indexOf(event) != -1){
				col.splice(col.indexOf(event), 1);
				if(col.length == 0){
					var colIndex = $scope.selectedEventsColumns.indexOf(col);
					$scope.selectedEventsColumns.splice(colIndex, 1)
				}
			}
		}
		$scope.selectedEvents.splice(index, 1);
		$scope.orderAllSelectedEvents();
	};

	$scope.toggleEventSelection = function(event){
		var index = $scope.selectedEvents.indexOf(event);
		if(index != -1){
			$scope.deselectEventByIndex(index);
		} else {
			$scope.selectEvent(event);
		}
	};

	$scope.eventIsSelected = function(event){
		return $scope.selectedEvents.indexOf(event) != -1;
	};

	$scope.timeToFloat = function(time){
		var timeArray = time.split(':');
		return (timeArray[0] - $scope.getStartTimeInt()) * 100 + timeArray[1] / 3 * 5;
	};

	$scope.getStartTimeInt = function(){
		var timeArray = $scope.dayPlan.start.split(':');
		return parseInt(timeArray[0]);
	};

	$scope.floatToTime = function(float){
		var floatHours = Math.floor(float);
		var flowMinutes = (float-floatHours) * 60;
		var timeArray = [floatHours, ("0" + flowMinutes).slice(-2)];
		return timeArray.join(':');
	};

	$scope.colWidth = function(){
		return 100/$scope.selectedEventsColumns.length;
	}

});

/**
 * Services
 */
app.factory('EventsDataService', function ($http) {
	var promiseEvents = null;
	var selectedEvents = [];

	return {
		getEvents: function () {
			if (!promiseEvents) {
				promiseEvents = $http.get('data/events.json').then(function (response) {
					return response.data;
				});
			}
			return promiseEvents;
		},
		getEventsFromHTML: function(){
			var currentId = 1;
			var events = [];
			$('.data #accordion').find('.tucbox-collapse').each(function(){
				var institute = $(this).find('.tucbox-collapse-heading').text();
				var instituteObject = {
					title: institute,
					children: []
				};

				$(this).find('.tucbox-collapse-body').each(function(){
					var searchForFieldResult = $(this).find('h4');

					if(searchForFieldResult.length) {
						searchForFieldResult.each(function () {
							var field = $(this).text();
							var fieldObject = {
								title: field,
								children: []
							};
							$('tr').has(this).nextAll().each(function () {
								if ($(this).find('h4').length == 0) {
									var event = createEventFromTr($(this), currentId++);
									fieldObject.children.push(event);
								} else {
									return false;
								}
							});
							instituteObject.children.push(fieldObject);
						});
					} else {
						$(this).find('tr').each(function(){
							var event = createEventFromTr($(this), currentId++);
							instituteObject.children.push(event);
						});
					}


				});
				events.push(instituteObject);
			});
			console.log(JSON.stringify(events));
			return events;
		}
	};

});

/**
 * Filter
 */
app.filter("sanitize", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	}
}]);

function createEventFromTr(tr, currentId){
	var tds = tr.find('td');

	var textArray = $(tds[1]).html().split('<br>');
	var title = textArray[0];
	var description = textArray.slice(1, textArray.length).join('<br>');

	return eventObject = {
		id: currentId,
		time: $(tds[0]).text().replace('.',':').replace(' Uhr', ''),
		duration: 1,
		room: $(tds[2]).text(),
		title: title,
		description: description
	};
}