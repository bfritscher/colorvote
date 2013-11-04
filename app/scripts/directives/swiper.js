'use strict';

angular.module('colorvoteApp')
  .directive('voteswiper', function () {
    return {
      restrict: 'A',
      link: function postLink($scope) {
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
        
      }
    };
  })
  .directive('historyswiper', function() {
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
