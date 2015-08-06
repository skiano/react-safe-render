
module.exports = function safeRender (React, config) {
  config = config || {};
  config.errorHandler = config.errorHandler || function () {};

  if (React.hasOwnProperty('unsafeCreateClass')) { return React; }

  React.unsafeCreateClass = React.createClass;

  React.createClass = function (spec) {
    var original = {componentClass: {}};
    var wrapBound = wrap.bind(null, spec, original, config);

    [ 'render',
      'componentWillMount',
      'componentDidMount',
      'componentWillReceiveProps',
      'componentWillUpdate',
      'componentDidUpdate',
      'componentWillUnmount'
    ].forEach(function (name) {
      wrapBound(name);
    });

    wrapBound('shouldComponentUpdate', safeShouldComponentUpdate);
    wrapBound('getInitialState', safeGetInitial);

    original.componentClass = React.unsafeCreateClass.apply(React, arguments);
    return original.componentClass;
  };

  return React;
};

function wrap(spec, original, config, method, returnFn) {
  if (!spec.hasOwnProperty(method)) { return; }

  var unsafe = spec[method];

  spec[method] = function () {
    try {
      return unsafe.apply(this, arguments);
    } catch (e) {
      if (original.componentClass.bubbleErrors) {
        throw e;
      }

      var report = {
        displayName: original.componentClass.displayName,
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
      } catch (err) {
        console.error('[Error Handler]', err.stack);
        return returnFn ? returnFn() : null;
      }
    }
  };
}

function safeShouldComponentUpdate() {
  return true;
}

function safeGetInitial() {
  return {};
}
