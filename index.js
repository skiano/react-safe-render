
module.exports = function safeRender (React, config) {

  config = config || {};
  config.errorHandler = config.errorHandler || function () {};

  if (React.hasOwnProperty('unsafeCreateClass')) { return; }

  React.unsafeCreateClass = React.createClass;

  React.createClass = function (spec) {

    var componentClass = {},
      unsafeRender = spec.render;

    spec.render = function () {
      try {
        return unsafeRender.apply(this, arguments);
      } catch (e) {
        
        // TODO: allow interesting handling from user
        config.errorHandler({
          displayName: componentClass.displayName,
          props: this.props,
          error: e
        });

        return null;
      }
    };

    // store ref to class in closure so error reporting can be more specific
    componentClass = React.unsafeCreateClass.apply(React, arguments);

    return componentClass;

  };

  return React;

};
