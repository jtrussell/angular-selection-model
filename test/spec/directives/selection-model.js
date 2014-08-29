/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect, iit */

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
    scope.record = [];
    scope.callback = function(item) {
      if(item.selected) {
        scope.record.push(item.value);
      } else {
        scope.record.push('-' + item.value);
      }
    };
  });

  describe('basics', function() {
    var el, tpl = [
      '<ul>',
        '<li ng-repeat="item in bag"',
            'selection-model',
            'selection-model-on-change="callback(item)">',
          '{{$index + 1}}: {{item.value}}',
        '</li>',
      '</ul>'
    ].join('\n');

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

    it('should execute callbacks when selected status changes (single)', function() {
      el.children().first().click(); // Does nothing
      el.children().last().click(); // Deselects foo, selects bar
      el.children().first().click(); // Deselects bar, selects foo
      expect(scope.record).toEqual(['-foo', 'bar', '-bar', 'foo']);
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
        '<li ng-repeat="item in bag"',
            'selection-model ',
            'selection-model-type="checkbox"',
            'selection-model-mode="multiple"',
            'selection-model-selected-items="selection"',
            'selection-model-on-change="callback(item)">',
        '<input type="checkbox" /> {{item.value}}',
        '</li>',
      '</ul>'
    ].join('\n');

    beforeEach(function() {
      el = compile(tpl, scope);
    });

    it('should allow multiple selected items', function() {
      scope.bag[2].selected = true;
      scope.$apply();
      expect(el.find('li').first().hasClass('selected')).toBe(true);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
      expect(scope.selection.length).toBe(2);
    });

    it('should still force single-selection on clicks without shift or ctrl', function() {
      el.find('li').last().click();
      expect(el.find('li').first().hasClass('selected')).toBe(false);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
      expect(scope.selection.length).toBe(1);
    });

    it('should honor ctrl (meta) clicks', function() {
      var e = jQuery.Event('click', {metaKey: true});
      el.find('li').last().trigger(e);
      expect(el.find('li').first().hasClass('selected')).toBe(true);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
      expect(scope.selection.length).toBe(2);
    });

    it('should honor shift clicks', function() {
        angular.forEach(scope.bag, function(bag){
            bag.selected = false;
        });
        scope.$apply();
        expect(scope.selection.length).toBe(0); //all selections should be cleared

        var e = jQuery.Event('click', {shiftKey: true});
        el.find('li').first().click(); //click first element - no shift
        el.find('li').last().trigger(e); //click last element with shift
        expect(el.find('li.selected').length).toBe(scope.bag.length);
        expect(scope.selection.length).toBe(scope.bag.length);
    });

    it('should sandbox checkbox clicks', function() {
      el.find('li').last().find('input').click();
      expect(el.find('li').first().hasClass('selected')).toBe(true);
      expect(el.find('li').last().hasClass('selected')).toBe(true);
      var e = jQuery.Event('click', {shiftKey: true});
      el.find('li').first().find('input').trigger(e);
      expect(jQuery(el.find('li')[1]).hasClass('selected')).toBe(false);
    });

    it('should only fire callbacks for things that actually changed', function() {
      scope.bag = [
        {selected: true, value: 'foo'},
        {selected: false, value: 'wowza'},
        {selected: false, value: 'blargus'},
        {selected: false, value: 'bar'}
      ];
      scope.$apply();
      var eShift = jQuery.Event('click', {shiftKey: true})
        , eCtrl = jQuery.Event('click', {metaKey: true});
      el.find('li').eq(1).click(); // Deselects foo, Selects wowza
      el.find('li').first().trigger(eCtrl); // Select foo
      el.find('li').last().trigger(eShift); // Shift-selects bar (should not double toggle wowza)
      expect(scope.record).toEqual(['-foo', 'wowza', 'foo', 'blargus', 'bar']);
    });
  });

  describe('with multi-additive mode', function() {
    var el, tpl = [
      '<ul>',
        '<li ng-repeat="item in bag"',
            'selection-model ',
            'selection-model-on-change="callback(item)"',
            'selection-model-mode="multiple-additive">',
          '{{item.value}} <input type="checkbox">',
        '</li>',
      '</ul>'
    ].join('\n');

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

    it('should only fire callbacks for things that actually changed', function() {
      scope.bag = [
        {selected: true, value: 'foo'},
        {selected: false, value: 'wowza'},
        {selected: false, value: 'blargus'},
        {selected: false, value: 'bar'}
      ];
      scope.$apply();
      var e = jQuery.Event('click', {shiftKey: true});
      el.find('li').first().click(); // Deselects foo
      el.find('li').eq(1).click(); // Selects wowza
      el.find('li').first().click(); // Select foo
      el.find('li').last().trigger(e); // Shift-selects bar (should not double toggle wowza)
      expect(scope.record).toEqual(['-foo', 'wowza', 'foo', 'blargus', 'bar']);
    });
  });

  describe('cleanup strategy', function() {
    beforeEach(function() {
      scope.myFilter = '';
    });
  
    afterEach(function() {
      delete scope.myFilter;
    });

    describe('default', function() {
      var el, tpl = [
        '<ul>',
          '<li ng-repeat="item in bag | filter:myFilter"',
            'selection-model>',
          '</li>',
        '</ul>'
      ].join('\n');

      beforeEach(function() {
        el = compile(tpl, scope);
      });

      it('should leave items selected when no longer visible', function() {
        scope.myFilter = 'dinosaur';
        scope.$apply();
        expect(scope.bag[0].selected).toBe(true);
      });
    });

    describe('deselect', function() {
      var el, tpl = [
        '<ul>',
          '<li ng-repeat="item in bag | filter:myFilter"',
            'selection-model',
            'selection-model-selected-items="selection"',
            'selection-model-cleanup-strategy="deselect">',
          '</li>',
        '</ul>'
      ].join('\n');

      beforeEach(function() {
        el = compile(tpl, scope);
      });

      it('should deselect items that are no longer visible', function() {
        scope.myFilter = 'dinosaur';
        scope.$apply();
        expect(scope.bag[0].selected).toBe(false);
      });

      it('should remove non-visible items from list of selected items', function() {
        scope.myFilter = 'dinosaur';
        scope.$apply();
        expect(scope.selection.length).toBe(0);
      });
    });
  });

  describe('selected items list', function() {
    var el, tpl = [
      '<ul>',
        '<li ng-repeat="item in bag" ',
            'selection-model ',
            'selection-model-mode="multiple" ',
            'selection-model-selected-items="selection">',
        '{{item.value}}',
        '</li>',
      '</ul>'
    ].join('');

    beforeEach(function() {
      el = compile(tpl, scope);
    });

    // See issue #13
    it('should have elements when selected item are clicked again (#13)', function() {
      el.children().first().click();
      el.children().first().click();
      expect(scope.selection.length).toBe(1);
    });
    
  });

});
