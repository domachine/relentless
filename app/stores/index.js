var EventEmitter = require('events').EventEmitter;
var _ = require('highland');

var reduce = require('../reducers');

var store = new EventEmitter();

exports.dispatch = store.emit.bind(store, 'action');

exports.stream = _('action', store)
  .sequence().errors(handleError).scan({}, reduce);

function handleError(error, push) {

  // Generating special error action.
  return {type: 'ERROR', error};
}
