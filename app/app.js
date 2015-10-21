import {EventEmitter} from 'events';
import _ from 'highland';
import Router from 'routes';
import React from 'react';
import ReactDOM from 'react-dom';

import reduce from './reducers';
import db from './db';
import design from './design';

var router = Router();
router.addRoute('/dashboard', require('routes/dashboard/show'));
router.addRoute('/invoices', require('routes/invoices/index'));
router.addRoute('/invoices/new', require('routes/invoices/new'));
router.addRoute('*', () => ({_url: '/dashboard'}));

var store = new EventEmitter();
var actionStream = _('action', store);
var locationStream = _(push => {
  var trigger = window.onhashchange = () => push(null, window.location.hash);
  trigger();
}).map(hash => (hash || '#').slice(1));

var stateStream = _.merge([actionStream, locationStream])
  .map(a =>
    typeof a === 'string'
      ? _([{_view: null, _url: null}])
          .concat(
            _.merge([
              _(db.info()),
              _([router.match(a)])
                .map(m => m.fn(m.params))
                .flatMap(r => _.isStream(r) ? r : _([r]))
            ])
          )
          .map(a =>
            a.type === undefined && typeof a !== 'string'
              ? {data: a}
              : a
          )
      : a
  )
  .flatMap(a => _.isStream(a) ? a : _([a]))
  .map(a => typeof a === 'string' ? {data: {_url: a}} : a)
  .doto(a => console.log('action', a.data))
  .scan({}, (state, action) =>
    action.type === undefined
      ? {... state, ... action.data}
      : reduce(state, action)
  );

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
    stateStream.each(state => {
      var props = {
        ... state,
        dispatch: store.emit.bind(store, 'action')
      };

      window.STATE = state;
      if (typeof state._url === 'string') {
        window.location.hash = state._url;
      } else if (state._view != null) {
        ReactDOM.render(<state._view {... props}/>, document.querySelector('#app'));
      }
    });
  });
var stringifyDesign = design =>

  // Little hack to conveniently convert the design doc to JSON.
  JSON.parse(JSON.stringify(
    design,
    (k, v) => typeof v === 'function' ? v.toString() : v
  ));
