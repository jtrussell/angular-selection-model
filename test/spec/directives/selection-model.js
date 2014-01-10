/*global describe, beforeEach, it, module, inject, expect */
/*jshint node:true */

describe('Directive: selectionModel', function() {
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
      {selected: false, value: 'bar'}
    ];
    scope.selection = [];
  });


  describe('basics', function() {
    var tpl = [
      '<ul>',
        '<li ng-repeat="item in bag" selection-model>',
          '{{$index + 1}}: {{item.value}}',
        '</li>',
      '</ul>'
    ].join('');

    it('should attach a "selected" class to selected items', function() {
      var el = compile(tpl, scope);
      expect(ng.element(el.children()[0]).hasClass('selected')).toBe(true);
      expect(ng.element(el.children()[1]).hasClass('selected')).toBe(false);
    });

    it('should respond to scope changes', function() {
      var el = compile(tpl, scope);
      scope.bag[0].selected = false;
      scope.bag[1].selected = true;
      scope.$apply();
      expect(ng.element(el.children()[0]).hasClass('selected')).toBe(false);
      expect(ng.element(el.children()[1]).hasClass('selected')).toBe(true);
    });

    it('should force a single selection by default', function() {
      var el = compile(tpl, scope);
      scope.bag[1].selected = true;
      scope.$apply();
      expect(ng.element(el.children()[0]).hasClass('selected')).toBe(false);
      expect(ng.element(el.children()[1]).hasClass('selected')).toBe(true);
    });
  });

  describe('with checkboxes', function() {
    var tpl = [
      '<table>',
        '<tbody>',
          '<tr ng-repeat="item in bag" ',
              'selection-model ',
              'selection-model-type="checkbox">',
            '<td><input type="checkbox"></td>',
            '<td>{{$index + 1}}: {{item.value}}</td>',
          '</tr>',
        '</tbody>',
      '</table>'
    ].join('');
    
    it('should set first checkbox values', function() {
      var el = compile(tpl, scope);
      expect(
        ng.element(el.children()[0].children[0].children[0].children[0]).prop('checked')
      ).toBe(true);

      expect(
        ng.element(el.children()[0].children[1].children[0].children[0]).prop('checked')
      ).toBe(false);
    });
  });

  /**
   * @todo
   */
  describe('with multiselect enabled', function() {
    var tpl = [
      '<ul>',
        '<li ng-repeat="item in bag" ',
            'selection-model ',
            'selection-model-mode="multiple">',
          '{{item.value}} <input type="checkbox">',
        '</li>',
      '</ul>'
    ].join('');

    
  });

  /**
   * @todo
   */
  describe('with selection tracking', function() {
    var tpl = [
      '<ul>',
        '<li ng-repeat="item in bag" ',
            'selection-model ',
            'selection-model-mode="multiple"> ',
            'selection-model-selected-items="selection" ',
          '{{item.value}} <input type="checkbox">',
        '</li>',
      '</ul>'
    ].join('');

  });
});
