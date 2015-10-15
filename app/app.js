var _ = require('highland');
var router = require('routes')();
var React = require('react');
var ReactDOM = require('react-dom');

var store = require('./stores');

var renderer = (() => {
  var state = {};

  return {
    setState(v) {
      state = {... state, ... v};
    },

    render(Component, props) {
      state = {... state, ... props};
      ReactDOM.render(
        <Component {... state}/>,
        document.getElementById('app')
      );
    }
  };
})();

router.addRoute('/dashboard', require('routes/dashboard/show'));
router.addRoute('/invoices', require('routes/invoices/index'));
router.addRoute('/invoices/new', require('routes/invoices/new'));
router.addRoute('*', () => window.location.hash = '/dashboard');

store.subscribe(renderer.setState);
window.onhashchange = route;
route();

function render(Component, props) {
  ReactDOM.render(<Component {... props}/>, document.getElementById('app'))
}

function route() {
  let match = router.match((window.location.hash || '#').slice(1));
  match
    ? callRoute(match)
    : console.log('not found!');
}

function callRoute(match) {
  match.fn(match.params, renderer.render);
}
