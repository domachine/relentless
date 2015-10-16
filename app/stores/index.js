var EventEmitter = require('events').EventEmitter;
var _ = require('highland');

var reduce = require('../reducers');

var store = new EventEmitter();

exports.dispatch = store.emit.bind(store, 'action');
exports.subscribe = store.on.bind(store, 'change');

_('action', store)
  .sequence().errors(handleError).scan({}, reduce)
  .each(state => store.emit('change', state));

function handleError(error, push) {

  // Generating special error action.
  return {type: 'ERROR', error};
}
