angular.module('selectionModel').directive('selectionModel', [
  'selectionStack', 'uuidGen', '$log',
  function(selectionStack, uuidGen, $log) {
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
        var smMode = attrs.selectionModelMode || defaultMode
          , isMultiMode = /^multi(ple)?$/.test(smMode);

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

        /**
         * The last-click stack id
         *
         * There may be multiple selection models on the page and each will need
         * independent click stacks.
         */
        var clickStackId = (function() {
          if(!isMultiMode) {
            return null;
          }
          var idAttr = 'data-selection-model-stack-id';
          // Id may be cached on this element
          var stackId = element.attr(idAttr);
          if(stackId) {
            return stackId;
          }

          // Otherwise it may be on the partent
          stackId = element.parent().attr(idAttr);
          if(stackId) {
            element.attr(idAttr, stackId);
            return stackId;
          }

          // welp guess we're the first, create a new one and cache it on this
          // element (for us) and the parent element (for others)
          stackId = uuidGen.create();
          element.attr(idAttr, stackId);
          element.parent().attr(idAttr, stackId);
          return stackId;
        }());

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

        /**
         * Item click handler
         *
         * Use the `ctrl` key to select/deselect while preserving the rest of
         * your selection. Note your your selection mode must be set to
         * `'multiple'` to allow for more than one selected item at a time. In
         * single select mode you still must use the `ctrl` or `shitft` keys to
         * deselect an item.
         *
         * The `shift` key allows you to select ranges of items at a time. Use
         * `ctrl` + `shift` to select a range while preserving your existing
         * selection. In single select mode `shift` behaves like `ctrl`.
         *
         * When an item is clicked with no modifier keys pressed it will be the
         * only selected item.
         *
         * On Mac the `meta` key is treated as `ctrl`.
         */
        element.on('click', function(event) {
          var isCtrlKeyDown = event.ctrlKey || event.metaKey
            , isShiftKeyDown = event.shiftKey;

          // Select multiple allows for ranges - use shift key
          if(isShiftKeyDown && /^multi(ple)?$/.test(smMode)) {
            // Use ctrl+shift for additive ranges
            if(!isCtrlKeyDown) {
              deselectAllItems();
            }
            selectItemsBetween(selectionStack.peek(clickStackId));
            scope.$apply(updateDom);
            return;
          }

          // Use ctrl/shift without multi select to true toggle a row
          if(isCtrlKeyDown || isShiftKeyDown) {
            var isSelected = !smItem[selectedAttribute];
            if(!/^multi(ple)?$/.test(smMode)) {
              deselectAllItems();
            }
            smItem[selectedAttribute] = isSelected;
            if(smItem[selectedAttribute]) {
              selectionStack.push(clickStackId, smItem);
            }
            scope.$apply(updateDom);
            return;
          }

          // Otherwise the clicked on row becomes the only selected item
          deselectAllItems();
          smItem[selectedAttribute] = true;
          selectionStack.push(clickStackId, smItem);
          scope.$apply(updateDom);
        });

        // We might be coming in with a selection
        updateDom();

        scope.$watchCollection(repeatParts[0], updateDom);
      }
    };
  }
]);
