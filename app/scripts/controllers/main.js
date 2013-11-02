'use strict';

angular.module('colorvoteApp')
  .controller('MainCtrl', ['$scope', '$window', '$location', function ($scope, $window, $location) {
    $scope.rooms = [
		{name: 'ANT1032'}, {name:'HEGArc'}, {name:'Test'}
    ];
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
	  $location.path( path );
	};
  }]);
