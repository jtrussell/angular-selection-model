# Angular Selection Model

> Angular directive for managing selections in tables and lists

## Huh? What about ngGrid, ngTable, or ...

They are all great at what they do and `selectionModel` is not meant to be a
replacement for any of those things. `selectionModel` works directly with the
`ngRepeat` directive, it does **nothing** other than manage the selected state
of the items `ngRepeat` iterates over (ok fine, it also changes some class names
and checkbox states if you're into that sort of thing).

Here's an simple example:

```javascript
angular.module('myApp').controller('FancyStuffCtrl', function() {
  this.stuff = [
    {selected: false, label: 'Scotchy scotch'},
    {selected: true, label: 'Monacle'},
    {selected: false, label: 'Top hat'}
  ];
});
```

```html
<ul ng-controller="FancyStuffCtrl as fancy">
  <li ng-repeat="item in fancy.stuff" selection-model>
    {{$index+1}}: {{item.label}}
  </li>
</ul>
```

That's it! Your list will key in on the "selected" attribute by default, respond
to mouse clicks, and reflect programmatic changes to `stuff`.


## Pieces of flare

So how do you let the user know about their selection? By default
`selectionModel` adds a `selected` class to its selected `li` or `tr`. It's up
to you to style those elements differently. If you're using checkboxes you can
also have their checked state match the item's selected state.


## Going farther

You can customize the behavior of your selection model by setting different
attributes on your `ngRepeat`ed element.

### selectionModelType
Default: `'basic'`

Supports either `'basic'` or `'checkbox'`. When set to basic the directive will
look for the first input element in each item (assume it is a checkbox) and
update its selected status to match the state of the item.

```html
<table>
  <tr ng-repeat="item in fancy.stuff"
      selection-model
      selection-model-type="checkbox">
    <td><input type="checkbox"></td>
    <td>{{$index+1}}</td>
    <td>{{item.label}}</td>
  </tr>
</table>
```

Note that you do not need to manually set the checkbox state.

### selectionModelMode
Default: `'single'`

May be be either `'single'` or `'multiple' (or `'multi'`). Make use of this
option to to allow the user select multiple items using their `shift` and `ctrl`
keys.

The behavior of the multi select mode is modeled after ExtJS data grids.


## Even more...

Check out the docs (as soon as I hit the codebase with dox that is...)


## Running examples

Install dependencies with `npm` and `bower` then run `grunt server`. You'll need
the `grunt-cli` module installed globally.


## Release history

*(nothing yet)*


## License

MIT
