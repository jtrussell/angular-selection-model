
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
        element.on('click', function(event) {
          event.selectionModelIgnore = true;
        });
      }
    };
  }
]);
