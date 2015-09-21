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

  var el;

  var tpl = [
    '<ul>',
      '<li ng-repeat="item in bag" ',
          'selection-model>',
        '{{$index + 1}}: {{item.value}}',
        '<span selection-model-ignore>Will not change selection!</span>',
      '</li>',
    '</ul>'
  ].join('');

  var tplDynamic = [
    '<ul>',
      '<li ng-repeat="item in bag" ',
          'selection-model>',
        '{{$index + 1}}: {{item.value}}',
        '<span selection-model-ignore="ignore">Will not change selection!</span>',
      '</li>',
    '</ul>'
  ].join('');

  it('should cause selectionModel to ignore clicks', function() {
    el = compile(tpl, scope);
    el.children().last().find('span').click();
    expect(scope.bag[0].selected).toBe(true);
    expect(scope.bag[2].selected).toBe(false);
  });

  it('should be toggle-able', function() {
    scope.ignore = false;
    el = compile(tplDynamic, scope);
    el.children().last().find('span').click();
    expect(scope.bag[0].selected).toBe(false);
    expect(scope.bag[2].selected).toBe(true);
  });

});

