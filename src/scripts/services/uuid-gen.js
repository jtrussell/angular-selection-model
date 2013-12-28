/*jshint bitwise:false */

angular.module('selectionModel').service('uuidGen', function() {
  'use strict';
  var exports = {};

  /**
   * @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
   */
  exports.create = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  return exports;
});
