'use strict';

angular.module('colorvoteApp')
  .directive('qrcode', function () {
    return {
      template: '<div class="qrcode"></div>',
      restrict: 'E',
	  replace : true,
	  scope:{
		href: '=href',
		width: '=width',
		height: '=height' 
	  },
      link: function postLink(scope, element, attrs) {
		scope.$watch('[href, width, height]', function(){
			var qrCode = new QRCode(element[0], {
				width: scope.width || 400,
				height: scope.height || 400,
				text: scope.href || 'empty'
			});
		}, true);
      }
    };
  });
