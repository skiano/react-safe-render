
// TODO: protect errors in error handler?

module.exports = function safeRender (React, config) {
  config = config || {};
  config.errorHandler = config.errorHandler || function () {};

  if (React.hasOwnProperty('unsafeCreateClass')) { return; }

  React.unsafeCreateClass = React.createClass;

  React.createClass = function (spec) {
    var componentClass = {};

    function wrap(method, returnFn) {
      if (!spec.hasOwnProperty(method)) { return; }

      var unsafe = spec[method];

      spec[method] = function () {
        try {
          return unsafe.apply(this, arguments);
        } catch (e) {
          config.errorHandler({
            displayName: componentClass.displayName,
            method: method,
            props: this.props,
            error: e
          });
          return typeof returnFn === 'function' ? returnFn.apply(this, arguments) : null;
        }
      };
    }

    wrap('render');
    wrap('componentWillMount');
    wrap('componentWillReceiveProps');

    // store ref to class in closure so error reporting can be more specific
    componentClass = React.unsafeCreateClass.apply(React, arguments);

    return componentClass;
  };

  return React;
};
