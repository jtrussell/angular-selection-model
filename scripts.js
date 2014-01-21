/*global angular */
(function(ng) {
'use strict';
  
ng.module('demo', ['selectionModel']);

ng.module('demo').controller('FancyCtrl', function() {
  
  this.bag = [
    {selected: false, label: 'Monacle', value: 53},
    {selected: true, label: 'Top Hat', value: 27},
    {selected: false, label: 'Mustachio', value: 11},
    {selected: false, label: 'Coffee', value: 45}
  ];

  this.selectedItems = [];

});

}(angular));
