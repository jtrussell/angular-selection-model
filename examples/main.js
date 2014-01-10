(function(ng) {

'use strict';

var app = ng.module('demo', ['selectionModel']);

app.controller('BasicCtrl', function() {
  this.items = [
    {selected: true, value: 78, label: 'seventy eight'},
    {selected: false, value: 62, label: 'sixty two'},
    {selected: false, value: 23, label: 'twenty three'},
    {selected: true, value: 15, label: 'fifteen'},
    {selected: false, value: 100, label: 'one hundred'},
    {selected: false, value: 3, label: 'three'},
    {selected: false, value: 23, label: 'twenty three'},
    {selected: true, value: 1, label: 'one'},
    {selected: false, value: 55, label: 'fifty five'},
    {selected: false, value: 2000, label: 'two thousand'}
  ];

  this.selectedItems = [];
});

app.controller('NonStandardCtrl', function() {
  this.items = [
    {is_checked: true, value: 33, label: 'foo'},
    {is_checked: false, value: 44, label: 'foobar'},
    {is_checked: false, value: 55, label: 'wowbar'},
    {is_checked: false, value: 66, label: 'snapper'}
  ];

  this.selectedItems = [];
});

}(angular));
