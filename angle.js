(function (angular) {

  /**
   * Unnamed handler type
   *
   * @type {number}
   */
  var UNNAMED = 0x10;

  /**
   * Named handler type.
   *
   * @type {number}
   */
  var NAMED = 0x20;

  /**
   * Mapping between an angular module method and a specific handler.
   */
  var types = {
    dependencies: UNNAMED,
    config: UNNAMED,
    run: UNNAMED,
    controller: NAMED,
    directive: NAMED,
    service: NAMED,
    factory: NAMED,
    provider: NAMED,
    filter: NAMED,
    constant: NAMED,
    value: NAMED
  };

  /**
   * Contains the registry for the proxy angular module.
   */
  var registry = {
    config: [],
    run: [],
    controller: [],
    directive: [],
    service: [],
    factory: [],
    provider: [],
    filter: [],
    animation: [],
    constant: [],
    value: []
  };

  /**
   * Contains the angular instance requirements.
   *
   * @type {Array}
   */
  var requires = [];

  /**
   * Contains the proxy to the angular instance.
   *
   * @type {{}}
   */
  var angle = window.angle = {};

  // Register the angular module proxy methods inside the angle object.
  for (var type in types) {
    angle[type] = getHandler(type, types[type]);
  }

  /**
   * Allows modules to require other modules.
   *
   * @param {Array} req
   *  An array of strings with the name of the modules.
   * @returns {{}}
   */
  angle.require = function (req) {
    requires = requires.concat(req);

    return angle;
  };

  /**
   * Bootstraps the angular module instance.
   *
   * All components registered through the proxy angle module are now bound to
   * the angular module instance.
   *
   * @returns {{}}
   */
  angle.bootstrap = function () {

    // Create the angular module instance.
    var instance = angular.module('angle', requires);

    // Bind the elements in the proxy registry to the angular instance.
    bindRegistry(instance);

    // Magically replace our proxy object with the angular module instance.
    window.angle = instance;

    // Finally, bootstrap angular.
    angular.bootstrap(window.document, ['angle']);
  };

  // Helpers
  // --------------------------------------------------------------------------

  /**
   * Gets the appropriate handler function for a given type/mode combination.
   *
   * @param type
   *  The method type
   * @param mode
   *  The mode. Can be either UNNAMED or NAMED.
   * @returns {Function}
   *  The handler function depending on the given type/mode combination.
   */
  function getHandler(type, mode) {
    var named = function (name, value) {
      registry[type].push({name: name, value: value});

      return angle;
    };

    var unnamed = function (value) {
      registry[type].push({ value: value });

      return angle;
    };

    return (mode === UNNAMED) ? unnamed : named;
  }

  /**
   * Binds the proxy registry to the angular module instance.
   */
  function bindRegistry(instance) {
    for (var type in registry) {
      var items = registry[type];

      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (types[type] == NAMED) {
          instance[type](item.name, item.value);
        }

        if (types[type] == UNNAMED) {
          instance[type](item.value);
        }
      }
    }
  }

}(angular));
