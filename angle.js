(function (angular) {

  /**
   * Unnamed handler type.
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
   * Contains the registry for the proxy angular module.
   */
  var registry = {
    config: { mode: UNNAMED, entries: [] },
    run: { mode: UNNAMED, entries: [] },
    controller: { mode: NAMED, entries: [] },
    directive: { mode: NAMED, entries: [] },
    service: { mode: NAMED, entries: [] },
    factory: { mode: NAMED, entries: [] },
    provider: { mode: NAMED, entries: [] },
    filter: { mode: NAMED, entries: [] },
    animation: { mode: NAMED, entries: [] },
    constant: { mode: NAMED, entries: [] },
    value: { mode: NAMED, entries: [] }
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
  for (var type in registry) {
    angle[type] = getHandler(type, registry[type].mode);
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

    return instance;
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
      registry[type].entries.push({name: name, value: value});

      return angle;
    };

    var unnamed = function (value) {
      registry[type].entries.push({ value: value });

      return angle;
    };

    return (mode === UNNAMED) ? unnamed : named;
  }

  /**
   * Binds the proxy registry to the angular module instance.
   */
  function bindRegistry(instance) {
    for (var type in registry) {
      var entries = registry[type].entries;

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];

        if (registry[type].mode == NAMED) {
          instance[type](entry.name, entry.value);
        }

        if (registry[type].mode == UNNAMED) {
          instance[type](entry.value);
        }
      }
    }
  }

}(angular));
