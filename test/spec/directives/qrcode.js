'use strict';

describe('Directive: qrcode', function () {

  // load the directive's module
  beforeEach(module('colorvoteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<qrcode></qrcode>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the qrcode directive');
  }));
});
