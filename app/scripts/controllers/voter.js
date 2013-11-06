'use strict';

angular.module('colorvoteApp')
  .controller('VoterCtrl', ['$scope', '$location', 'model', '$window', '$routeParams',
    function ($scope, $location, model, $window, $routeParams) {
    ga('send', 'pageview', $location.path());
    var roomName = $routeParams.room;
    
    $scope.data = model.data;
    
    $scope.choices = [0,1,2,3,4,5,6,7];
    $scope.showCardVote = false;
    $scope.toggleCardVote = function(){
      var url = $location.path();
      if(!$scope.showCardVote){
        url += '/cards';
      }
      ga('send', 'pageview', url);
      $scope.showCardVote = !$scope.showCardVote;
    };
    $scope.setVote = function(vote){
      $scope.data.question.vote = vote;
      //TODO: maybe c:0
      model.vote();
    };
    $scope.go = function ( path ) {
      $location.path( path );
    };

    $scope.$on('$destroy', function () {
      model.leave(roomName);
    });
    $window.onbeforeunload = function(){
      model.leave(roomName);
    };
    
    $scope.$root.loading = false;
  }]);
