'use strict';

angular.module('colorvoteApp')
  .controller('UsersCtrl', ['$scope', 'model', function ($scope, model) {
    model.getUsers();
    $scope.data = model.data;
    $scope.userId = function(user){
      return user._id;
    };
    $scope.makeAdmin = function(user){
      model.makeAdmin(user._id, user.admin);
    };
    $scope.isDisabled = function(user){
      return model.data.user._id === user._id;
    };
  }]);
