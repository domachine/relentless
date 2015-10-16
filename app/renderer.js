var React = require('react');
var ReactDOM = require('react-dom');

var state = {};

exports.setState = (v) => state = {... state, ... v};

exports.render = (Component, props) => {
  state = {... state, ... props};
  ReactDOM.render(
    <Component {... state}/>,
    document.getElementById('app')
  );
};
