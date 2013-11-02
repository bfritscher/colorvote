'use strict';

angular.module('colorvoteApp')
  .controller('VoterCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.room = {
		name: 'ANT1031'
	};
	$scope.question = {
		possibleAnswers: 8,
		state:'started',
		dateStarted: new Date(),
		roomId: 1,
		votes: 34,
		results: [0, 2, 6, 8, 2, 5, 4, 7],
		modified: new Date()
	};
	
	$scope.vote = {
		vote: 3
	};
	$scope.choices = [0,1,2,3,4,5,6,7];
	$scope.showCardVote = false;
	$scope.toggleCardVote = function(){
		var url = '/' + $scope.room.name
		if(!$scope.showCardVote){
			 url += '/cards';
		}
		ga('send', 'pageview', url);
		$scope.showCardVote = !$scope.showCardVote;
	}
	//TODO: vote service
	$scope.setVote = function(vote){
		$scope.vote.vote = vote;
	}
	$scope.go = function ( path ) {
	  $location.path( path );
	};
	//TODO: create directive
	var swiper = new Swiper('.swiper-container.voter',{
		pagination: '.pagination',
		paginationClickable: true,
		createPagination: true,
		loop: true,
		watchActiveIndex: true,
		queueEndCallbacks: true,
		onSlideChangeEnd: function(swiper){
			$scope.$apply(function(){
				$scope.setVote(swiper.activeLoopIndex);
			});
		}
	});
	
	$scope.$watch( "[question.possibleAnswers, vote.vote, choices]", function(){
		var possibleAnswers = $scope.question.possibleAnswers;
		var toCreate = possibleAnswers + 2 - swiper.slides.length;
		for(var i=0; i< toCreate;i++){
			swiper.createSlide('<div class="title"></div>').append();
		}
		
		for(var i=0; i < possibleAnswers + 2; i++){
			var slide = swiper.getSlide(i);
			if(slide && possibleAnswers > 0){
				//fix loop
				var j = i;
				if(j === possibleAnswers + 1){
					j = 0;
				}else if(j === 0){
					j = possibleAnswers - 1;
				}else{
					j = i - 1;
				}
				slide.className = 'swiper-slide color-' + j;
				slide.querySelector('.title').textContent = $scope.choices[j];
			}
		};
		while(possibleAnswers + 2 < swiper.slides.length){
			var slide = swiper.getSlide(possibleAnswers + 2);
			if(slide){
				if(slide.isActive()){
					swiper.swipeTo(0, 0);
				}
				slide.remove();
			}
		}
		
		if(swiper.activeLoopIndex != $scope.vote.vote && $scope.vote.vote < possibleAnswers){
			swiper.swipeTo($scope.vote.vote, 0);
		}
	}, true);
	
  }]);
