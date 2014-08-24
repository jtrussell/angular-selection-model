/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect, iit */

describe('Directive: selectionModelIgnore', function() {
  'use strict';

  var ng = angular;

  var scope, compile;

  beforeEach(module('selectionModel'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();

    compile = function(tpl, scp) {
      var $el = $compile(ng.element(tpl))(scp);
      scp.$apply();
      return $el;
    };
  }));

  beforeEach(function() {
    scope.bag = [
      {selected: true, value: 'foo'},
      {selected: false, value: 'wowza'},
      {selected: false, value: 'bar'}
    ];
    scope.selection = [];
    scope.record = [];
    scope.callback = function(item) {
      if(item.selected) {
        scope.record.push(item.value);
      } else {
        scope.record.push('-' + item.value);
      }
    };
  });

  var el, tpl = [
    '<ul>',
      '<li ng-repeat="item in bag" ',
          'selection-model>',
        '{{$index + 1}}: {{item.value}}',
        '<span selection-model-ignore>Will not change selection!</span>',
      '</li>',
    '</ul>'
  ].join('');

  beforeEach(function() {
    el = compile(tpl, scope);
  });

  it('should cuase selectionModel to ignore clicks', function() {
    el.children().last().find('span').click();
    expect(scope.bag[0].selected).toBe(true);
    expect(scope.bag[2].selected).toBe(false);
  });

});

