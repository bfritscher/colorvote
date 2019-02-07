'use strict';
var app = {};

var CONFIG = {
  clientId: '192909161969.apps.googleusercontent.com',
  scopes: ['email']
};

app.module = angular.module('colorvoteApp', [
  'ngRoute',
  'uuid4',
  'LocalStorageModule'
]);

app.module.value('config', CONFIG);

app.loadRoomQuestion = function ($route, model) {
  var room = $route.current.params.room;
  if($route.current.originalPath.split('/').pop() === 'admin'){
    room += '-admin';
  }
  return model.join(room);
};
app.loadRoomQuestion.$inject = ['$route', 'model'];

app.loadAdmin = function(model){
  return model.requireAuth(true).then(function () {
    return model.authorize();
  });
};
app.loadAdmin.$inject = ['model'];

app.module.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/admin', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        user: app.loadAdmin
      }
    })
    .when('/users', {
      templateUrl: 'views/users.html',
      controller: 'UsersCtrl',
      resolve: {
        user: app.loadAdmin
      }
    })
  .when('/:room', {
      templateUrl: 'views/voter.html',
      controller: 'VoterCtrl',
      resolve: {
        question: app.loadRoomQuestion
      }
    })
  .when('/:room/admin', {
      templateUrl: 'views/asker.html',
      controller: 'AskerCtrl',
      resolve: {
        question: app.loadRoomQuestion,
        user: app.loadAdmin
      }
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.module.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.module.run(['$rootScope', '$location', function ($rootScope, $location) {
  // Error loading room
  $rootScope.$on('$routeChangeError', function () {
    $location.path('/');
  });
}]);

gapi.load('auth:client', function () {
  gapi.auth.init();
  angular.element(document).ready(function () {
    angular.bootstrap(document, ['colorvoteApp']);
  });
});