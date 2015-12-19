var app = angular.module('challengesManagerApp', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {templateUrl: 'templates/page/challenges.html'})
		.when('/details', {templateUrl: 'templates/page/details.html'})
		.when('/about', {templateUrl: 'templates/page/about.html'})
		.otherwise({redirectTo: '/'});
});

/**
 * Controller
 */
// List
app.controller('ChallengesCtrl', function ($scope, $location, ChallengeDataService) {
	$scope.challenges = null;

	ChallengeDataService.getChallenges().then(function (data) {
		$scope.challenges = data;
		console.log($scope.challenges);
	});

	$scope.selectChallenge = function (challenge) {
		ChallengeDataService.setSelectedChallenge(challenge);
		$location.path("/details");
	}

});

// Details
app.controller('ChallengeDetailsCtrl', function ($scope, $location, ChallengeDataService) {
	$scope.challenges = null;
	$scope.selectedChallenge = ChallengeDataService.getSelectedChallenge();
	$scope.currentChallengeProgress = {
		completed: 0,
		skipped: 0,
		open: 0
	};

	ChallengeDataService.getChallenges().then(function (data) {
		$scope.challenges = data;
	});

	$scope.updateCurrentChallengeProgress = function () {
		// reset
		$scope.currentChallengeProgress = {
			completed: 0,
			skipped: 0,
			open: 0
		};

		// count
		if($scope.selectedChallenge && $scope.selectedChallenge.hasOwnProperty('plan')) {
			var plan = $scope.selectedChallenge.plan;
			for (stepKey in plan) {
				if (plan.hasOwnProperty(stepKey)) {
					switch (plan[stepKey].status) {
						case 0:
							$scope.currentChallengeProgress.open++;
							break;
						case 1:
							$scope.currentChallengeProgress.completed++;
							break;
						case 2:
							$scope.currentChallengeProgress.skipped++;
							break;
					}
				}
			}
		}

	};

	$scope.getResultPercentage = function(){
		if($scope.selectedChallenge && $scope.selectedChallenge.hasOwnProperty('plan')) {
			return ($scope.currentChallengeProgress.completed / Object.keys($scope.selectedChallenge.plan).length * 100).toFixed(2);
		}
		return null;
	};

	$scope.$watch('selectedChallenge', function(newValue, oldValue){
		console.log('challenge updated');
		$scope.updateCurrentChallengeProgress();
	}, true);

	$scope.clearSelectedChallenge = function () {
		ChallengeDataService.setSelectedChallenge(null);
		$location.path("/");
	};

	if (!$scope.selectedChallenge) {
		$location.path("/");
	}
});

/**
 * Services
 */
app.factory('ChallengeDataService', function ($http) {
	var promiseChallenges = null;
	var selectedChallenge = null;

	return {
		getChallenges: function () {
			if (!promiseChallenges) {
				promiseChallenges = $http.get('data/challenges.json').then(function (challengesResponse) {
					return challengesResponse.data;
				});
			}
			return promiseChallenges;
		},
		getSelectedChallenge: function () {
			return selectedChallenge;
		},
		setSelectedChallenge: function (challenge) {
			selectedChallenge = challenge;
		}
	};

});