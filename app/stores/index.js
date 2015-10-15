var EventEmitter = require('events').EventEmitter;
var _ = require('highland');

var store = new EventEmitter();

exports.dispatch = store.emit.bind(store, 'action');
exports.subscribe = store.on.bind(store, 'change');

var reduce = (state, action) => state;

_('action', store)
  .errors(handleError)
  .scan({}, reduce)
  .each(state => store.emit('change', state))

function handleError(error, push) {

  // Generating special error action.
  return {type: 'ERROR', error};
}
