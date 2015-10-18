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

setup()
  .apply(() => {
    _([locationStore(router).stream, store.stream])
      .merge()
      .scan({}, _.flip(_.extend))
      .each(update);
  });

function error404() {
  throw new Error('Route handler didn\'t return a view');
}

function update(state) {
  window.STATE = state;
  if (typeof state.View === 'string') {
    window.location.hash = state.View;
  } else if (state.View != null) {
    ReactDOM.render(<state.View {... state}/>, document.querySelector('#app'));
  }
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
        )) : _([])
    );
}
