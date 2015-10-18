var _ = require('highland');
var View = require('views/invoices/new.jsx');

module.exports = (params, render) => _([{
  View,
  invoice: {
    _id: 'de.domachine.invoice:1',
    lineItems: []
  }
}]);
