'use strict';
//TODO create Angular constant
//TODO test and remvoe fastclick if ng-click works
var Config = {
	numMaxAnswers: 8
};

function padLeft(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}

angular.module('colorvoteApp', [
  'ngRoute',
  'ngCookies'
])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
	  //TODO FIX room redirect
	  .when('/:room', {
        templateUrl: 'views/voter.html',
        controller: 'VoterCtrl'
      })
	  .when('/asker', {
        templateUrl: 'views/asker.html',
        controller: 'AskerCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
