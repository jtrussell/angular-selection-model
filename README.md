# Angular Selection Model

[![Build Status](https://travis-ci.org/jtrussell/angular-selection-model.svg?branch=master)](https://travis-ci.org/jtrussell/angular-selection-model)

> Angular directive for managing selections in tables and lists

## Huh? What about ngGrid, ngTable, or ...

They are all great at what they do and `selectionModel` is not meant to be a
replacement for any of those things. `selectionModel` works directly with the
`ngRepeat` directive, it does **nothing** other than keep track of which of the
iterated over items are selected.

How does it work? The directive looks for a particular attribute on your
collection items, by default that's `selected`. When an item becomes selected
that attribute is set to `true`... when it gets deselected (surprise) it's set
to `false`. You can programmatically flip the state of that attribute as well
and the directive will respond by updating your view. For convenience we also
expose a read only list of just the selected items.

So when should you use `selectionModel`? You might consider it if:

- You want to make a list or table selectable but don't need lots extra bells
  and whistles.
- You want a grid/list whose styles painlessly match the rest of your app.
- You're making your own fancy grid directive and want to offload selection
  management.

Here's a simple example, we'll start with the controller:

```javascript
angular.module('myApp').controller('FancyStuffCtrl', function() {
  this.stuff = [
    {selected: false, label: 'Scotchy scotch'},
    {selected: true, label: 'Monacle'},
    {selected: true, label: 'Curly mustache'},
    {selected: false, label: 'Top hat'}
  ];
});
```

and the markup:

```html
<ul ng-controller="FancyStuffCtrl as fancy">
  <li ng-repeat="item in fancy.stuff" selection-model>
    {{$index+1}}: {{item.label}}
  </li>
</ul>
```

(don't forget to include the `selectionModel` module in you app).

```javascript
angular.module('myApp', ['selectionModel']);
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
Type: `String`
Default: ''basic'`

Supports either `'basic'` or `'checkbox'`. When set to checkbox the directive
will look for the first input element in each item (assume it is a checkbox) and
update its selected status to match the state of the item.

```html
<table>
  <tr ng-repeat="item in fancy.stuff"
      selection-model
      selection-model-type="'checkbox'">
    <td><input type="checkbox"></td>
    <td>{{$index+1}}</td>
    <td>{{item.label}}</td>
  </tr>
</table>
```

Note that you do not need to manually set the checkbox state.

### selectionModelMode
Type: `String`
Default: `'single'`

May be be either `'single'`, `'multiple'`, or `'multiple-additive'`. Make use of
the multi* modes to to allow the user select more than one item at a time.

The behavior of the multi select mode is modeled after ExtJS data grids. By
default a vanilla click (no `shift` or `ctrl`) will set the entire selection to
the single item clicked. Use `multiple-additive` to have vanilla clicks add to
the selection (and remove when the item is already selected).

```html
<table>
  <tr ng-repeat="item in fancy.stuff"
      selection-model
      selection-model-mode="'multiple-additive'">
    <td>{{$index+1}}</td>
    <td>{{item.label}}</td>
  </tr>
</table>
```

### selectionModelSelectedAttribute
Type: `String`
Default: `'selected'`

The collection attribute used to track the selected status of your collection
items. Note that you can set this globally using
`selectionModelOptionsProvider`.

```html
<ul>
  <li ng-repeat="item in fancy.stuff"
      selection-model
      selection-model-selected-attribute="'checked'">
    <!-- Now selection-model will use `item.checked` instead of `item.selected` -->
    {{item.label}}
  </li>
</ul>
```

### selectionModelSelectedClass
Type: `String`
Default: `'selected'`

The class name `selection-model` assigns to selected items in your view. Note
that you can set this globally using `selectionModelOptionsProvider`.

```html
<ul>
  <li ng-repeat="item in fancy.stuff"
      selection-model
      selection-model-selected-class="'checked'">
    <!-- Now selection-model will assign a classname of `checked` to select list items-->
    {{item.label}}
  </li>
</ul>
```

### selectionModelCleanupStrategy
Type: `String`
Default: `'none'`

By default this directive will not change the selected state of your repeated
over collection items as they come in and out of view. In many cases you may
want items to be automatically deselected as they are filtered away or the user
"pages" a grid view. Use `'deselect'` to get this behavior.

Example: John is looking at page 1 of a data grid and selects some items. John
changes his mind, goes to the second page of data, selects different items and
then hits the submit button. Using the cleanup strategy `none` all items from
the first page that John left selected would still be selected, with
the `deselect` strategy though those items would have been deselected when he
changed pages and only the second page items would be selected.

```html
<table>
  <tr ng-repeat="item in fancy.stuff"
      selection-model
      selection-model-cleanup-strategy="'deselect'">
    <td>{{$index+1}}</td>
    <td>{{item.label}}</td>
  </tr>
</table>
```

### selectionModelSelectedItems
Type: `Array`
Default: `undefined`

If used this should resolve to an initially empty array.  The directive will
keep the contents of that array up to date with the selection in your
collection. Note that this is a **read only** list. Adding items will have no
effect on your collection - and order is not guarenteed.

Also keep in mind that unless you're using a mode which allows for more than one
selected item this will always be an array of length 1.

In your controller:

```javascript
myApp.controller('SillyCtrl', function() {
  this.items = [ /* a bunch of stuff */ ];

  // Should start empty even if you have an initial selection
  this.selectedItems = []; 
});
```

In your view

```html
<div ng-controller="SillyCtrl as silly">
  <ul>
    <li ng-repeat="item in silly.items"
        selection-model
        selection-model-mode="'multiple-additive'"
        selection-model-selected-items="silly.selectedItems">
      Click me!
    </li>
  </ul>

  <p>
    You've selected {{silly.selectedItems.length}} item(s)
  </p>
</div>
```

### selectionModelOnChange
Type: `Expression`
Default: `undefined`

Use this attribute to register a callback for when the selected state of a
collection item **changes**.

In your controller:

```javascript
myApp.controller('SillyCtrl', function() {
  this.items = [ /* a bunch of stuff */ ];
  this.changed = function(item) {
    // Do something with item, its selected status has changed!
  }
});
```

In your view:

```html
<div ng-controller="SillyCtrl as silly">
  <ul>
    <li ng-repeat="item in silly.items"
        selection-model
        selection-model-mode="'multiple-additive'"
        selection-model-on-change="silly.changed(item)">
      Click me!
    </li>
  </ul>

  <p>
    You've selected {{silly.selectedItems.length}} item(s)
  </p>
</div>
```


## Extras

### selectionModelIgnore

A helper directive you can use to tell `selectionModel` to selectively ignore
clicks on certain elements. This is useful in cases where you need to manage
selection changes yourself or you don't selections to change at all (think
"delete" buttons).

```html
<div ng-controller="SillyCtrl as silly">
  <ul>
    <li ng-repeat="item in silly.items"
        selection-model
        selection-model-mode="'multiple-additive'"
        selection-model-on-change="silly.changed(item)">
      Click me!
      <button selection-model-ignore class="close">
        &times;
      </button>
    </li>
  </ul>
```

This directive is dynamic, if the value assigned to `selectionModelIgnore` is
falsey at the time of the click the click will *not* be ignored:

```html
<div ng-controller="SillyCtrl as silly">
  <ul>
    <li ng-repeat="item in silly.items"
        selection-model
        selection-model-mode="'multiple-additive'"
        selection-model-on-change="silly.changed(item)">
      Click me!
      <button selection-model-ignore="false" class="close">
        &times; (NOT ignored)
      </button>
      <button selection-model-ignore="true" class="close">
        &times; (ignored)
      </button>
    </li>
  </ul>
```


## Providing Configuration

### The `selectionModelOptionsProvider`

Use the `selectionModelOptionsProvider` in your module's `config` method to set
global options.

```javascript
myApp.config(function(selectionModelOptionsProvider) {
  selectionModelOptionsProvider.set({
    selectedAttribute: 'mySelectedObjectAttribute',
    selectedClass: 'my-selected-dom-node',
    type: 'checkbox',
    mode: 'multiple-additive',
    cleanupStrategy: 'deselect'
  });
});
```


## Even more...

Check out the docs (as soon as I hit the codebase with dox that is...)


## Limitations and common pitfalls

- You must use the single parent form of ngRepeat. I.e. if you're trying to use
  this module with `ng-repeat-start` and `ng-repeat-end` you won't have much
  joy.
- ngRepeat expressions that break reference to items in your collection are not
  supported. If your express looks like `'item in array | pluck:attributesHash'`
  you won't have much joy. I.e. at the end of the day `'item'` should be an
  actual element in `'array'`.
- This directive works by reading from and assigning to an attribute on the
  items in your collection. If you are worried about polluting your items'
  attributes consider using the selectionModelOptions provider to make the
  attribute more obscure or wrapping your items in something like `{selected:
  false, payload: item}`.
- At present `selection-model` listens for clicks *anywhere* on the repeated
  element. If you have a child element that programmatically changes your
  collection item's selected state when clicked you may end up bumping heads
  with `selection-model`. Be wary of this when it seems like your selection is
  not changing and you have your own click handlers registered to change the
  selection. For such cases we provide the `selectionModelIgnore` helper
  directive.
- Do not rely on `selection-model` to maintain the state of your collections
  outside the view. For example, don't mark an item as selected in controller
  code then send your collection to the backend server expecting
  `selection-model` to have appropriately deselected other items. Doing so
  creates an undesireable coupling with angular's digest cycle. Instead, when
  making manual selection changes, you should take care to make *all* appropriate
  selections and deselections if you need immediate consistency.


## Running tests

Install dependencies with `npm` and `bower` then run `grunt test`. You'll need
the `grunt-cli` module installed globally.


## Running examples

Install dependencies with `npm` and `bower` then run `grunt server`. You'll need
the `grunt-cli` module installed globally. Run this way the examples will reload
automatically as you make changes within the examples folder or to the source
files themselves.

You may also simply open `examples/index.html` with your favorite web browser if
the whole grunt thing isn't your cup of tea.


## Getting help

Use the tag **angular-selection-model** on Stack Overflow. For quick things I can
be reached on twitter @jusrussell. A plunk/jsbin/fiddle is worth a thousand words.


## Release history

- 2015-10-08 v0.10.0 BREAKING CHANGES - see MIGRATING.md
- 2015-09-21 v0.9.0 Make `selectionModelIgnore` dynamic
- 2014-10-29 v0.8.3 Don't double count label clicks
- 2014-07-08 v0.7.0 Added support `selectionModelOnChange` attribute
- 2014-02-27 v0.5.0 Checkbox clicks should affect no other rows
- 2014-01-15 v0.4.1 Correctly remove filtered out elements from selected items
  list
- 2014-01-10 v0.4.0 Expose read only list of selected items
- 2014-01-08 v0.3.0 Add `selectionModelOptionsProvider` for global configuration
- 2013-12-30 v0.2.0 Add new mode `multi-additive`.
- 2013-12-30 v0.1.2 Deselect filtered out items.
- 2013-12-28 v0.1.1 Initial release.


## License

[MIT](https://raw.github.com/jtrussell/angular-selection-model/master/LICENSE-MIT)
