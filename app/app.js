import {EventEmitter} from 'events';
import url from 'url';
import ever from 'ever';
import _ from 'highland';
import React from 'react';
import ReactDOM from 'react-dom';

import reduce from './reducers';
import db from './db';
import design from './design';
import routes from './routes';

var store = new EventEmitter();
var actionEmitter = new EventEmitter();
var actions = _('action', actionEmitter);
var locations = _.concat(
  _('hashchange', ever(window)),
  [{newURL: window.location.toString()}]
);
var router = _.pipeline(
  _.map(e => (url.parse(e.newURL).hash || '#').slice(1)),
  _.map(u => routes.match(u)),
  _.map(m => m.fn(m.params))
);

var appStream = _([
  actions,
  locations
    .pipe(router)
    .flatMap(m =>
      _([{
        _location: window.location.hash,
        _view: null,
        alert: null,
        notice: null
      }]).concat([m])
    )
]).merge();

var stateStream = appStream
  .flatMap(a => _.isStream(a) ? a : _([a]))
  .map(a =>
    typeof a === 'string'
      ? ({type: '@', data: {_location: a}})
      : a.type === undefined ? ({type: '@', data: a}) : a
  )
  .doto(console.log.bind(console))
  .scan({}, (state, action) =>
    action.type === '@'
      ? {... state, ... reduce(state, action), ... action.data}
      : {... state, ... reduce(state, action)}
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
      let props = {
        ... state,
        dispatch: actionEmitter.emit.bind(actionEmitter, 'action')
      };
      if (state._location != null) {
        window.location.hash = state._location;
      }
      if (state._view != null) {
        ReactDOM.render(
          <state._view {... props}/>,
          document.querySelector('#app')
        );
      }
    });
  });

var stringifyDesign = design =>

  // Little hack to conveniently convert the design doc to JSON.
  JSON.parse(JSON.stringify(
    design,
    (k, v) => typeof v === 'function' ? v.toString() : v
  ));
