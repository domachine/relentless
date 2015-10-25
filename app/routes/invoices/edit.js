var _ = require('highland');
import View from 'views/invoices/edit.jsx';

var db = require('db');

module.exports = params =>
  _(db.get('de.domachine.invoice:' + params.id))
    .map(res => ({editingInvoice: res}))
    .append({_view: View});