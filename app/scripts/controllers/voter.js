'use strict';

angular.module('colorvoteApp')
  .controller('VoterCtrl', ['$scope', '$location', 'model', '$window',
    function ($scope, $location, model, $window) {
    ga('send', 'pageview', $location.path());
    
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
    
    //CLEANUP: create/move to a directive
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
    
    $scope.$watch('[data.question.possibleAnswers, data.question.vote, choices]', function(){
      var possibleAnswers = $scope.data.question.possibleAnswers;
      var toCreate = possibleAnswers + 2 - swiper.slides.length;
      var slide;
      for(var i=0; i< toCreate;i++){
        swiper.createSlide('<div class="title"></div>').append();
      }
      for(i=0; i < possibleAnswers + 2; i++){
        slide = swiper.getSlide(i);
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
      }
      while(possibleAnswers + 2 < swiper.slides.length){
        slide = swiper.getSlide(possibleAnswers + 2);
        if(slide){
          if(slide.isActive()){
            swiper.swipeTo(0, 0);
          }
          slide.remove();
        }
      }
      
      if(swiper.activeLoopIndex !== $scope.data.question.vote && $scope.data.question.vote < possibleAnswers){
        swiper.swipeTo($scope.data.question.vote, 0);
      }
    }, true);

    $scope.$on('$destroy', function () {
      model.leave($scope.data.question.room);
    });
    $window.onbeforeunload = function(){
      model.leave($scope.data.question.room);
    };
    
    $scope.$root.loading = false;
  }]);
