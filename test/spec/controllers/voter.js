'use strict';

describe('Controller: VoterCtrl', function () {

  // load the controller's module
  beforeEach(module('colorvoteApp'));

  var VoterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VoterCtrl = $controller('VoterCtrl', {
      $scope: scope
    });
  }));

});
