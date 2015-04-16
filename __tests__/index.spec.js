/** @jsx React.DOM */

jest.dontMock('../index');

var React = require('react/addons'),
  TestUtils = React.addons.TestUtils;

var errorHandler = jest.genMockFn();

// protect render
require('../index')(React, {
  errorHandler: errorHandler
});

function throwIf(name, props) {
  if (props[name]) {throw new Error(name);}
}

var ExampleComponent = React.createClass({
  componentWillMount: function () {
    throwIf('willMountError',this.props);
  },

  componentWillReceiveProps: function () {
    throwIf('recievePropsError',this.props);
  },

  render: function () {
    throwIf('renderError',this.props);
    return (<div className='success'></div>);
  }
});

describe('Safe Render', function () {
  
  it('should return the element normally if there are no errors', function () {
    var element = (<ExampleComponent/>);
    var mounted = TestUtils.renderIntoDocument(element);
    expect(mounted.getDOMNode().className).toEqual('success');
  });

  it('should catch errors in render', function () {
    expect(function () {
      TestUtils.renderIntoDocument(<ExampleComponent renderError/>);
    }).not.toThrow();
  });

  it('should catch errors in render', function () {
    errorHandler.mockClear();
    
    TestUtils.renderIntoDocument(<ExampleComponent renderError/>);

    expect(errorHandler.mock.calls[0][0]).toEqual({
      displayName: 'ExampleComponent',
      method: 'render',
      props: {
        renderError: true
      },
      error: new Error('renderError')
    });
  });

  it('should catch errors in componentWillMount', function () {
    errorHandler.mockClear();
    
    TestUtils.renderIntoDocument(<ExampleComponent willMountError/>);

    expect(errorHandler).lastCalledWith({
      displayName: 'ExampleComponent',
      method: 'componentWillMount',
      props: {
        willMountError: true
      },
      error: new Error('willMountError')
    });
  });

  it('should catch errors in componentWillReceiveProps', function () {
    errorHandler.mockClear();
    
    var stub = TestUtils.renderIntoDocument(<ExampleComponent recievePropsError/>);

    stub.setProps({new: true});

    expect(errorHandler).lastCalledWith({
      displayName: 'ExampleComponent',
      method: 'componentWillReceiveProps',
      props: {
        recievePropsError: true
      },
      error: new Error('recievePropsError')
    });
  });
});
