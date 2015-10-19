var _ = require('highland');
var router = require('routes')();
var React = require('react');
var ReactDOM = require('react-dom');

var store = require('./stores');
var locationStore = require('./stores/location_store');
var renderer = require('./renderer');
var db = require('./db');
var design = require('./design');
var actions = require('./actions');

router.addRoute('/dashboard', require('routes/dashboard/show'));
router.addRoute('/invoices', require('routes/invoices/index'));
router.addRoute('/invoices/new', require('routes/invoices/new'));
router.addRoute('*', () => _([{View: '/dashboard'}]));

/**
 * Update design doc if necessary.
 */

_(db.get('_design/relentless'))
  .errors((err, push) =>
    err.status === 404 ? push(null, {}) : push(err)
  )
  .flatMap(current =>
    current.version !== design.version
      ? _(db.put(
        _.extend(stringifyDesign(design), {_rev: current._rev})
      )) : _([current])
  )
  .apply(() => {
    _([locationStore(router).stream, store.stream])
      .merge()
      .scan({}, _.flip(_.extend))
      .each(state => {
        window.STATE = state;
        if (typeof state.View === 'string') {
          window.location.hash = state.View;
        } else if (state.View != null) {
          ReactDOM.render(<state.View {... state}/>, document.querySelector('#app'));
        }
      });
  });

var stringifyDesign = design =>

  // Little hack to conveniently convert the design doc to JSON.
  JSON.parse(JSON.stringify(
    design,
    (k, v) => typeof v === 'function' ? v.toString() : v
  ));
