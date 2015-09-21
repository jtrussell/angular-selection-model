
/**
 * Selection Model Ignore
 *
 * For clickable elements that don't directly interact with `selectionModel`.
 *
 * Useful for when you want to manually change the selection, or for things like
 * "delete" buttons that belong under `ngRepeat` but shouldn't select an item
 * when clicked.
 *
 * @package selectionModel
 * @copyright 2014 Justin Russell, released under the MIT license
 */

angular.module('selectionModel').directive('selectionModelIgnore', [
  function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var ignore = function(event) {
          event.selectionModelIgnore = true;

          /**
           * If jQuery is on the page `event` will actually be a jQuery Event
           * and other handlers will only get to see a subset of the event
           * properties that supported by all browsers. Our custom attribute
           * will be dropped. We need to instead decorate the original event
           * object.
           *
           * @see https://github.com/jtrussell/angular-selection-model/issues/27
           */
          if(event.originalEvent) {
            event.originalEvent.selectionModelIgnore = true;
          }
        };

        element.on('click', function(event) {
          if(!attrs.selectionModelIgnore || scope.$eval(attrs.selectionModelIgnore)) {
            ignore(event);
          }
        });
      }
    };
  }
]);
