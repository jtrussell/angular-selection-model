
# Migrating

This document contains notes for migrating between major version numbers of
`selection-model`. Note that there may also be breaking changes between minor
version numbers with major version 0. I will not introduce breaking changes for
patch bumps even under major version 0.


## Version 0.10.0

### All inline options now use JS value types

In previous versions some attributes accepted only plain strings as values,
`selection-model-type` is one such example:

```html
<li ng-repeat="item in silly.bag"
    selection-model
    selection-model-type="checkbox">
  <!-- item stuff -->
</li>
```

Note that the directive expects to interpolate `selection-model-type` as a
string literal. This is generally fine when using selection model directly but
makes life difficult if you intend to embed selection model within another
directive and pass forward inline options to it.

The new syntax allows for variables in property values as well as string
literals:

```html
<!--
scope = {
  silly: {
    modelType: 'checkbox'
  }
}
-->
<li ng-repeat="item in silly.bag"
    selection-model
    selection-model-type="silly.modelType">
  <!-- item stuff -->
</li>

<!-- or -->

<li ng-repeat="item in silly.bag"
    selection-model
    selection-model-type="'checkbox'"> <!-- note the additional quotes -->
  <!-- item stuff -->
</li>
```

