'use strict';

angular.module('colorvoteApp')
  .controller('MainCtrl', ['$scope', '$window', '$location', 'model',
  function ($scope, $window, $location, model) {
    $scope.data = model.data;
    model.data.question = {};
    model.getRooms();

    $scope.addRoom = function(){
      var name = $window.prompt('Room name?');
      if(name){
        model.updateRoom({name: name});
      }
    };
    $scope.renameRoom = function(room){
      var name = $window.prompt('Room name?', room.name);
      if(name && name.length > 0 && name !== room.name){
        //TODO rename room
        room.name = name;
        model.updateRoom(room);
      }
    };
    $scope.go = function ( path ) {
      $scope.$root.loading = true;
      if($scope.data.user.admin){
        path += '/admin';
      }
      $location.path( path );
    };
    $scope.$root.loading = false;
  }]);
