/*global jQuery, describe, beforeEach, it, module, inject, expect */

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
      {selected: false, value: 'wowza'},
      {selected: false, value: 'bar'}
    ];
    scope.selection = [];
  });

  describe('basics', function() {
    var el, tpl = [
      '<ul>',
        '<li ng-repeat="item in bag" selection-model>',
          '{{$index + 1}}: {{item.value}}',
        '</li>',
      '</ul>'
    ].join('');

    beforeEach(function() {
      el = compile(tpl, scope);
    });

    it('should attach a "selected" class to selected items', function() {
      expect(el.children().first().hasClass('selected')).toBe(true);
      expect(el.children().last().hasClass('selected')).toBe(false);
    });

    it('should respond to scope changes', function() {
      scope.bag[0].selected = false;
      scope.bag[2].selected = true;
      scope.$apply();
      expect(el.children().first().hasClass('selected')).toBe(false);
      expect(el.children().last().hasClass('selected')).toBe(true);
    });

    it('should force a single selection by default', function() {
      scope.bag[2].selected = true;
      scope.$apply();
      expect(el.children().first().hasClass('selected')).toBe(false);
      expect(el.children().last().hasClass('selected')).toBe(true);
    });

    it('should respond to clicks', function() {
      el.children().last().click();
      expect(el.children().first().hasClass('selected')).toBe(false);
      expect(el.children().last().hasClass('selected')).toBe(true);
    });
  });

  describe('with checkboxes', function() {
    var el, tpl = [
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

    beforeEach(function() {
      el = compile(tpl, scope);
    });
    
    it('should set first checkbox values', function() {
      expect(el.find('tr').first().find('input').prop('checked')).toBe(true);
      expect(el.find('tr').last().find('input').prop('checked')).toBe(false);
    });

    it('should update checkboxes on click events too', function() {
      el.find('tr').last().click();
      expect(el.find('tr').first().find('input').prop('checked')).toBe(false);
      expect(el.find('tr').last().find('input').prop('checked')).toBe(true);
    });
  });

  describe('with multi mode', function() {
    var el, tpl = [
      '<ul>',
        '<li ng-repeat="item in bag" ',
            'selection-model ',
            'selection-model-type="checkbox" ',
            'selection-model-mode="multiple">',
          '<input type="checkbox" /> {{item.value}}',
        '</li>',
      '</ul>'
    ].join('');

    beforeEach(function() {
      el = compile(tpl, scope);
    });

    it('should allow multiple selected items', function() {
      scope.bag[2].selected = true;
      scope.$apply();
      expect(el.find('li').first().hasClass('selected')).toBe(true);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
    });

    it('should still force single-selection on clicks without shift or ctrl', function() {
      el.find('li').last().click();
      expect(el.find('li').first().hasClass('selected')).toBe(false);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
    });

    it('should honor ctrl (meta) clicks', function() {
      var e = jQuery.Event('click', {metaKey: true});
      el.find('li').last().trigger(e);
      expect(el.find('li').first().hasClass('selected')).toBe(true);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
    });

    /**
     * @todo shift clicks
     */

    it('should sandbox checkbox clicks', function() {
      el.find('li').last().find('input').click();
      expect(el.find('li').first().hasClass('selected')).toBe(true);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
      var e = jQuery.Event('click', {shiftKey: true});
      el.find('li').first().find('input').trigger(e);
      expect(jQuery(el.find('li')[1]).hasClass('selected')).toBe(false);
    });
  });

  describe('with multi-additive mode', function() {
    var el, tpl = [
      '<ul>',
        '<li ng-repeat="item in bag" ',
            'selection-model ',
            'selection-model-mode="multiple-additive">',
          '{{item.value}} <input type="checkbox">',
        '</li>',
      '</ul>'
    ].join('');

    beforeEach(function() {
      el = compile(tpl, scope);
    });

    it('should not deselect automatically', function() {
      el.find('li').last().click();
      expect(el.find('li').first().hasClass('selected')).toBe(true);
    });

    it('should deselected selected items on click', function() {
      el.find('li').first().click();
      expect(el.find('li').first().hasClass('selected')).toBe(false);
    });
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
