var React = require('react');
var _ = require('highland');

var View = require('views/dashboard/show.jsx');
import {db} from 'utils';

module.exports = params =>
  _(db.query('relentless/invoices-by-number'))
    .map(res => ({total_invoices: res.total_rows}))
    .append({_view: View});
