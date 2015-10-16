var _ = require('highland');
var router = require('routes')();
var React = require('react');
var ReactDOM = require('react-dom');

var store = require('./stores');
var renderer = require('./renderer');
var db = require('./db');
var design = require('./design');
var actions = require('./actions');

router.addRoute('/dashboard', require('routes/dashboard/show'));
router.addRoute('/invoices', require('routes/invoices/index'));
router.addRoute('/invoices/new', require('routes/invoices/new'));
router.addRoute('*', () => window.location.hash = '/dashboard');

setup()
  .apply(() => {
    store.subscribe(state => window.STATE = state);
    store.subscribe(renderer.setState);
    window.onhashchange = route;
    route();
  });

function route() {
  let match = router.match((window.location.hash || '#').slice(1));
  match
    ? callRoute(match)
    : console.log('not found!');
}

function callRoute(match) {
  actions.fetchConfig(db)
    .apply(action => {
      store.dispatch([action]);
      match.fn(match.params, renderer.render)
    });
}

/**
 * Update design doc if necessary.
 */

function setup() {
  return _(db.get('_design/relentless'))
    .errors((err, push) =>
      err.status === 404 ? push(null, {}) : push(err)
    )
    .map(doc => doc.version === design.version)
    .flatMap(uptodate =>
      !uptodate
        ? _(db.put(

            // Little hack to conveniently convert the design doc to JSON.
            JSON.parse(JSON.stringify(
              design,
              (k, v) => typeof v === 'function' ? v.toString() : v
            ))
        )) : _([null])
    );
}
