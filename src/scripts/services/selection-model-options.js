
/**
 * Default options for the selection model directive
 *
 * 
 *
 * @package selectionModel
 */

angular.module('selectionModel').provider('selectionModelOptions', [function() {
  'use strict';

  var options = {
    selectedAttribute: 'selected',
    selectedClass: 'selected',
    type: 'basic',
    mode: 'single',
    cleanupStrategy: 'none'
  };

  this.set = function(userOpts) {
    angular.extend(options, userOpts);
  };

  this.$get = function() {
    var exports = {
      get: function() {
        return angular.copy(options);
      }
    };
    return exports;
  };


}]);
