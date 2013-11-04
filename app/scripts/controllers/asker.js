'use strict';

//TODO move somewhere reusable
function padLeft(number, size) {
  number = number.toString();
  while (number.length < size) {
    number = '0' + number;
  }
  return number;
}

angular.module('colorvoteApp')
  .controller('AskerCtrl', ['$scope', '$location', '$interval', 'model', '$window',
  function ($scope, $location, $interval, model, $window) {
    ga('send', 'pageview', $location.path());
    
    $scope.href = $location.absUrl().replace('/admin', '').replace('/#/', '/#'); //TODO: fix with better solution;
    $scope.data = model.data;
    $scope.model = model;
    $scope.votes = function(){
      if($scope.data.question.results){
        return $scope.data.question.results.reduce(function(a, b) {
          return a + b;
        });
      }
      return 0;
    };

    function calculateTimer(question){
      var time;
      if(question.state === 'stopped'){
        time = moment(question.dateStopped).diff(question.dateStarted);
      }else{
        time = moment().diff(question.dateStarted);
      }
      time = Math.round(time / 1000);
      var secondes = time % 60;
      return padLeft((time-secondes)/60,2) +  ':' +  padLeft(secondes,2);
    }
    
    var timer = function (){
      $scope.elapsedTime = calculateTimer($scope.data.question);
    };
    timer();
    $interval(timer, 1000);
    $scope.$watch('data.question.possibleAnswers',function(){
      //remove
      $scope.data.question.results = $scope.data.question.results.slice(0, $scope.data.question.possibleAnswers);
      //or add elements to fit possibleAnswers
      for(var i=0; i < $scope.data.question.possibleAnswers - $scope.data.question.results.length; i++){
        $scope.data.question.results.push(0);
      }
      
    });
    
    $scope.questionAction = function(){
      if(model.data.question.state === 'stopped'){
        $scope.showresults = false;
      }else{
        $scope.showresults = true;
      }
      model.questionAction();
    };
    
    $scope.toggleHistory = function(){
      if(!$scope.showhistory){
        model.getHistory();
      }
      $scope.showhistory=!$scope.showhistory;
    };
    
    //TODO create filter?
    $scope.formatTime = function(q){
      return calculateTimer(q);
    };
    
    $scope.formatDate = function(q){
      return moment(q.dateStopped).format('DD.MM.YYYY HH:mm');
    };
      
    $scope.$on('$destroy', function () {
      model.leave($scope.data.question.room);
    });
    $window.onbeforeunload = function(){
      model.leave($scope.data.question.room);
    };
    
    $scope.go = function ( path ) {
      $location.path( path );
    };

    $scope.$root.loading = false;
  }]);
