var _ = require('highland');
var router = require('routes')();
var ReactDOM = require('react-dom');

router.addRoute('/dashboard', require('routes/dashboard/show'));
router.addRoute('/invoices', require('routes/invoices/index'));
router.addRoute('/invoices/new', require('routes/invoices/new'));
router.addRoute('*', () => window.location.hash = '/dashboard');

window.onhashchange = route;
route();

function route() {
  let match = router.match((window.location.hash || '#').slice(1));
  match
    ? callRoute(match)
    : console.log('not found!');
}

function callRoute(match) {
  match.fn(match.params, component =>
    ReactDOM.render(component, document.getElementById('app'))
  );
}
