var React = require('react');
var ReactDOM = require('react-dom');

var Component;
var state = {};

exports.setState = (v) => {
  state = {... state, ... v};
  if (Component) {
    exports.render(Component, {});
  }
};

exports.render = (C, props) => {
  Component = C;
  state = {... state, ... props};
  ReactDOM.render(
    <Component {... state}/>,
    document.getElementById('app')
  );
};
