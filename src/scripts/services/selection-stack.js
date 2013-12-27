/*global console */

angular.module('selectionModel').service('selectionStack', function() {
  'use strict';
  var exports = {}
    , maxSize = 1000
    , stack = [];

  exports.push = function(item) {
    stack.push(item);
    while(stack.length > maxSize) {
      stack.shift();
    }
    return stack.length;
  };

  exports.pop = function() {
    return stack.pop();
  };

  exports.peek = function() {
    return stack.length ? stack[stack.length - 1] : undefined;
  };

  return exports;
});
