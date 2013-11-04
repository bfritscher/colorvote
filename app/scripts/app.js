'use strict';
var app = {};

var CONFIG = {
  clientId: '192909161969.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/userinfo.email']
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
  //TODO FIX room redirect
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

app.module.run(['$rootScope', '$location', function ($rootScope, $location) {
  // Error loading room
  $rootScope.$on('$routeChangeError', function () {
    $location.path('/');
  });
}]);

//TODO: cleanup quickfix for history swiper
app.module.directive('historyswiper', function() {
  return function(scope) {
    var swiper;
    scope.$watch('$last',function(v){
      if (v){
        if(swiper){ swiper.destroy(); }
        swiper = new Swiper('.history .swiper-container',{
          pagination: '.pagination',
          paginationClickable: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          loop: false,
          watchActiveIndex: true,
          initialSlide: 0,
          onFirstInit: function(){
            //Meteor.setTimeout(function(){document.querySelector('.swiper-wrapper').className='swiper-wrapper';}, 300);
          }
        });
      }
    });
  };
});