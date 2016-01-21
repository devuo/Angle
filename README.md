# Angle

Provides a smoother developer experience while using Angular.JS within Drupal.

Angle acts as a delayed proxy to the global angular object, which allows several modules to require dependencies, controllers, and everything else under a single angular module.

## Installation

To use angle you must first add Angular.JS under the libraries folder under the angle namespace. Angle will be looking for the Angular.js file under the following directory:

```
/sites/all/libraries/angle/angular.js
```

## How to use

### Require angle
The first is step is to require angle to be injected on the page. You do this calling ``angle_required()`` in your PHP code. Here's an example:

```php
<?php

/**
 * Implements hook_preprocess_HOOK()
 */
function mytheme_preprocess_page() {

  // If we wanted to inject angle in all pages handled
  // by theme 'mytheme' we would simply implement this hook
  // and call angle_required(). This would ensure angle to
  // be present in all pages rendered through this theme.
  angle_required();
}
```

### Using angle
The second step is calling angle instead of angular when declaring your controllers, directives, filters, etc. in your JavaScript code like so:

```js
(function (angle, Drupal) {

  // Here's an example controller
  angle.controller('MyModuleController', ['$scope',
    function ($scope) {
      $scope.state = {};
    }
  ]);
  
  // An here's an example translate filter using Drupal.t()
  angle.filter('translate', [
    function () {
      return function (input) {
        return Drupal.t(input);
      }
    }
  ]);

}(angle, Drupal));
```

Angle has the same interface that the Angular object has, and the Angle object is actually replaced by the actual Angular object soon as the angular module has been bootstraped.
