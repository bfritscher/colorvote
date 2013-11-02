'use strict';

angular.module('colorvoteApp')
  .controller('AskerCtrl', ['$scope', '$location', '$interval', function ($scope, $location, $interval) {
    $scope.room = {
		name: 'ANT1031'
	};
	$scope.href = $location.absUrl();
	$scope.question = {
		possibleAnswers: 8,
		state:'started',
		dateStarted: new Date(),
		roomId: 1,
		votes: 34,
		results: [0, 2, 6, 8, 2, 5, 4, 7],
		modified: new Date()
	};
	$scope.elapsedTime;
	$interval(function (){
		var time
		if($scope.question.state === 'stopped'){
			time = moment($scope.question.dateStopped).diff($scope.question.dateStarted);
		}else{
			time = moment().diff($scope.question.dateStarted);
		}
		time = Math.round(time / 1000);
		var secondes = time % 60;
		$scope.elapsedTime = padLeft((time-secondes)/60,2) +  ':' +  padLeft(secondes,2);
	}, 1000);
	$scope.$watch('question.possibleAnswers',function(){
		$scope.question.results = $scope.question.results.slice(0, $scope.question.possibleAnswers);
		console.log($scope.question.results);
	});
	
	$scope.go = function ( path ) {
	  $location.path( path );
	};
  }]);
