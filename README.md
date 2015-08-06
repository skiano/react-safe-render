# React Safe Render [![Build Status](https://secure.travis-ci.org/skiano/react-safe-render.png)](http://travis-ci.org/skiano/react-safe-render) [![NPM version](https://badge.fury.io/js/react-safe-render.svg)](http://badge.fury.io/js/react-safe-render)

Helper to make sure your react components do not kill your entire application when their lifecylce methods fail.

## Usage

Before any other components are created

```js

var React = require('react');

require('react-safe-render')(React, {
  errorHandler: function (errReport) {
    
    // if a component fails you can handle the failure however you want
    
    errReport.displayName // name of component that failed
    errReport.props // the props that the component recieved
    errReport.method // name of method that failed (ie: componentWillMount)
    errReport.arguments // arguments for the method that failed (if there were any)
    errReport.error // the original error object
  }
});

```

## Note on ES2015

At the moment this only works for components made via React.createClass(). It will not catch errors if you use the Component class directly.

## License

[MIT](/LICENSE)
