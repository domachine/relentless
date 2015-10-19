var _ = require('highland');

var View = require('views/invoices/new.jsx');
var db = require('utils').db;

module.exports = (params, render) =>
  _(db.query('relentless/invoices-by-number', {descending: true}))
    .map(({rows}) =>
      (rows[0] || {key: 1}).key
    )
    .map(number => ({
      View,
      invoice: {
        _id: `de.domachine.invoice:${number + 1}`,
        lineItems: []
      }
    }));
