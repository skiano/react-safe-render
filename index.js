
module.exports = function safeRender (React, config) {

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
        console.warn('Render Failure:', componentClass.displayName, this.props);
        return null;
      }
    };

    // store ref to class in closure so error reporting can be more specific
    componentClass = React.unsafeCreateClass.apply(React, arguments);

    return componentClass;

  };

  return React;

};
