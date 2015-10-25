import {EventEmitter} from 'events';
import _ from 'highland';
import React from 'react';
import ReactDOM from 'react-dom';

import reduce from './reducers';
import db from './db';
import design from './design';
import {stream as locationStream, Router} from './lib/routing';
import Event from './lib/event';

var store = new EventEmitter();
var actionStream = _(push =>
  store.on('action', a => {
    push(null, new Event('ACTION', a));
  })
);

var router = Router([
  ['/dashboard', require('routes/dashboard/show')],
  ['/invoices', require('routes/invoices/index')],
  ['/invoices/new', require('routes/invoices/new')],
  ['*', () => '/dashboard']
]);

var middleware = () => _(db.info())

var stateStream = _.merge([actionStream, locationStream])
  .flatMap(e => e.type === 'LOCATION_CHANGE'
    ? _([{_view: null, _url: null}])
        .concat(
          _.merge([middleware(), router(e.payload)])
        )

        // Transform each routing result into an action
        .map(a =>
          new Event('ACTION',
            a.type === undefined && typeof a !== 'string'
              ? {type: '@', data: a}
              : a
          )
        )
    : _([e])
  )

  // Flatten all actions
  .flatMap(e => e.type === 'ACTION' && _.isStream(e.payload)
    ? e.payload
    : _([e])
  )
  .map(e => e.payload)
  .map(a => typeof a === 'string' ? {type: '@', data: {_url: a}} : a)
  .scan({}, (state, action) =>
    action.type === '@'
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
