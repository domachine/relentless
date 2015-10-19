var _ = require('highland');

var View = require('views/invoices/index.jsx');
var utils = require('utils');

module.exports = params =>
  _(utils.db.query('relentless/invoices-by-number', {
    include_docs: true,
    descending: true
  }))
  .append({View});
