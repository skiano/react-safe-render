
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
          var report = {
            displayName: componentClass.displayName,
            method: method,
            props: this.props,
            error: e
          };
          if (arguments.length > 0) {
            report.arguments = arguments;
          }

          try {
            config.errorHandler(report);
            return returnFn ? returnFn() : null;  
          } catch (e) {
            console.error('[Error Handler]',e.stack);
            return returnFn ? returnFn() : null;
          }
        }
      };
    }

    wrap('render');
    wrap('componentWillMount');
    wrap('componentDidMount');
    wrap('componentWillReceiveProps');
    wrap('shouldComponentUpdate', safeShouldComponentUpdate);
    wrap('componentWillUpdate');
    wrap('componentDidUpdate');
    wrap('componentWillUnmount');
    wrap('getInitialState', safeGetInitial);

    // store ref to class in closure so error reporting can be more specific
    componentClass = React.unsafeCreateClass.apply(React, arguments);

    return componentClass;
  };

  return React;
};

function safeShouldComponentUpdate() {
  return true;
}

function safeGetInitial() {
  return {};
}
