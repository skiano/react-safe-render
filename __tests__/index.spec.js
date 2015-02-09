/** @jsx React.DOM */

jest.dontMock('../index');

var React = require('react/addons'),
  TestUtils = React.addons.TestUtils;

var errorHandler = jest.genMockFn();

// protect render
require('../index')(React, {
  errorHandler: errorHandler
});

var ExampleComponent = React.createClass({
  render: function () {
    if (this.props.hasBadData) {
      throw new Error('Bad Data');
    } else {
      return (<div className='success'></div>);
    }
  }
});

describe('Safe Render', function () {
  
  it('should return the element normally if there are no errors', function () {
    var element = (<ExampleComponent/>);
    var mounted = TestUtils.renderIntoDocument(element);
    expect(mounted.getDOMNode().className).toEqual('success');
  });

  it('should catch errors in render', function () {

    var element = (<ExampleComponent hasBadData/>);

    expect(function () {
      TestUtils.renderIntoDocument(element);
    }).not.toThrow();

  });

  it('should catch errors in render', function () {

    errorHandler.mockClear();

    var element = (<ExampleComponent hasBadData/>);
    
    TestUtils.renderIntoDocument(element);

    expect(errorHandler.mock.calls[0][0]).toEqual({
      displayName: 'ExampleComponent',
      props: {
        hasBadData: true
      },
      error: new Error('Bad Data')
    });

  });

});
