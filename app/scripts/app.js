'use strict';

function padLeft(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}
var app = {};

app.module = angular.module('colorvoteApp', [
  'ngRoute',
  'ngCookies',
  'uuid4'
]);

app.loadRoomQuestion = function ($route, model) {
  var room = $route.current.params.room;
  if($route.current.originalPath.split('/').pop() === 'admin'){
	room += '-admin';
  }
  return model.join(room);
};
app.loadRoomQuestion.$inject = ['$route', 'model'];


//quickfix for history swiper
app.module.directive('historyswiper', function() {
  return function(scope, element, attrs) {
	var swiper;
    scope.$watch('$last',function(v){
      if (v){
		if(swiper) swiper.destroy();
		swiper = new Swiper('.history .swiper-container',{
			pagination: '.pagination',
			paginationClickable: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			loop: false,
			watchActiveIndex: true,			
			initialSlide: 0,
			onFirstInit: function(swiper){
				//Meteor.setTimeout(function(){document.querySelector('.swiper-wrapper').className='swiper-wrapper';}, 300);
			}
		});		
	  }
    });
    
  };
})



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
			question: app.loadRoomQuestion
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
  