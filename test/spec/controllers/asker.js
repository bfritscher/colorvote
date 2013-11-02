'use strict';

describe('Controller: AskerCtrl', function () {

  // load the controller's module
  beforeEach(module('colorvoteApp'));

  var AskerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AskerCtrl = $controller('AskerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
