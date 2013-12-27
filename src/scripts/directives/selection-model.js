angular.module('selectionModel').directive('selectionModel', [
  'selectionStack',
  function(selectionStack) {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        /**
         * @todo Expose a provider to configure these
         */
        var defaultSelectedAttribute = 'selected'
          , defaultSelectedClass = 'selected'
          , defaultType = 'basic'
          , defaultMode = 'single';

        /**
         * The selection model type
         *
         * Controls how selections are presented on the underlying element. Use
         * 'basic' (the default) to simplye assign a "selected" class to
         * selected items. If set to 'checkbox' it'll also sync the checked
         * state of the first checkbox child in each underlying `tr` or `li`
         * element.
         *
         * Note that the 'checkbox' type assumes the first input child element
         * will be the checkbox.
         */
        var smType = attrs.selectionModelType || defaultType;

        /**
         * The selection mode
         *
         * Supports 'single' and 'multi[ple]'. Single mode will only allow one
         * item to be marked as selected at a time.
         */
        var smMode = attrs.selectionModelMode || defaultMode;

        /**
         * The item attribute to track selected status
         *
         * Use `selection-model-selected-attribute` to override the default
         * attribute.
         */
        var selectedAttribute = attrs.selectionModelSelectedAttribute || defaultSelectedAttribute;

        /**
         * The selected class name
         *
         * Will be applied to dom items (e.g. `tr` or `li`) representing
         * selected items. Use `selection-model-selected-class` to override the
         * default class name.
         */
        var selectedClass = attrs.selectionModelSelectedClass || defaultSelectedClass;

        /**
         * The list of items
         *
         * selectionModel must be attached to the same element as an ngRepeat
         */
        var repeatLine = attrs.ngRepeat;
        if(!repeatLine) {
          throw 'selectionModel must be used along side ngRepeat';
        }

        var repeatParts = repeatLine.split(' in ')
          , smItem = scope.$eval(repeatParts[0]);

        var updateDom = function() {
          if(smItem[selectedAttribute]) {
            element.addClass(selectedClass);
          } else {
            element.removeClass(selectedClass);
          }

          if('checkbox' === smType) {
            var cb = element.find('input');
            cb[0].checked = smItem[selectedAttribute];
          }
        };

        var getAllItems = function() {
          return scope.$eval(repeatParts[1]);
        };

        var deselectAllItems = function() {
          angular.forEach(getAllItems(), function(item) {
            item[selectedAttribute] = false;
          });
        };

        var selectItemsBetween = function(lastItem) {
          var allItems = getAllItems()
            , foundLastItem = false
            , foundThisItem = false;

          lastItem = lastItem || smItem;

          angular.forEach(getAllItems(), function(item) {
            foundThisItem = foundThisItem || item === smItem;
            foundLastItem = foundLastItem || item === lastItem;
            var inRange = (foundLastItem + foundThisItem) === 1;
            if(inRange || item === smItem || item === lastItem) {
              item[selectedAttribute] = true;
            }
          });
        };

        element.on('click', function(event) {
          // Select multiple allows for ranges - use shift key
          if(event.shiftKey && /^multi(ple)?$/.test(smMode)) {
            // Use ctrl+shift for additive ranges
            if(!event.ctrlKey) {
              deselectAllItems();
            }
            selectItemsBetween(selectionStack.peek());
            scope.$apply(updateDom);
            return;
          }

          // Use ctrl/shift without multi select to true toggle a row
          if(event.ctrlKey || event.shiftKey) {
            var isSelected = !smItem[selectedAttribute];
            if(!/^multi(ple)?$/.test(smMode)) {
              deselectAllItems();
            }
            smItem[selectedAttribute] = isSelected;
            if(smItem[selectedAttribute]) {
              selectionStack.push(smItem);
            }
            scope.$apply(updateDom);
            return;
          }

          // Otherwise the clicked on row becomes the only selected item
          deselectAllItems();
          smItem[selectedAttribute] = true;
          selectionStack.push(smItem);
          scope.$apply(updateDom);
        });

        // Update the dom if we're coming in with a selection
        updateDom();

        scope.$watchCollection(repeatParts[0], updateDom);
      }
    };
  }
]);
