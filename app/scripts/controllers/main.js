'use strict';

angular.module('colorvoteApp')
  .controller('MainCtrl', ['$scope', '$window', '$location', 'model',
  function ($scope, $window, $location, model) {
    $scope.data = model.data;
	model.data.question = {};
	model.getRooms();
	$scope.isAdmin = function(){
		return true;
	}
	$scope.addRoom = function(){
		var name = $window.prompt('Room name?');
		if(name){
			//TODO add room
			$scope.rooms.push({name: name});
		}
	};
	$scope.renameRoom = function(room){
		var name = $window.prompt('Room name?', room.name);
		if(name && name.length > 0 && name != room.name){
			//TODO rename room
			room.name = name;
		}
	}
	$scope.go = function ( path ) {
		$scope.$root.loading = true;
		if($scope.isAdmin()){
			path += '/admin';
		}
		$location.path( path );
	};
	$scope.$root.loading = false;
  }]);
