var _ = require('highland');

exports.fetchConfig = (db) =>
  _(db.get('config'))
    .errors((err, push) =>

      // Apply default configuration.
      push(null, {
        name: 'Unknown'
      })
    )
    .map(config =>
      ({type: 'HYDRATE_CONFIG', config})
    );

exports.createInvoice = (db, invoice) =>
  loading(
    _(db.put(invoice))
      .flatMap(res =>
        exports.updateEditingInvoice({_rev: res.rev})
          .append(`#/invoices/${res.id.split(':')[1]}/edit`)
      )
  );

exports.saveInvoice = exports.createInvoice;

exports.updateEditingInvoice = data => _([{
  type: 'UPDATE_EDITING_INVOICE',
  data
}]);

exports.addEditingInvoiceLineItem = data => _([{
  type: 'ADD_EDITING_INVOICE_LINE_ITEM',
  data
}]);

exports.destroyEditingInvoiceLineItem = index => _([{
  type: 'DESTROY_EDITING_INVOICE_LINE_ITEM',
  index
}]);

exports.updateEditingInvoiceLineItem = (index, data) => _([{
  type: 'UPDATE_EDITING_INVOICE_LINE_ITEM',
  index,
  data
}])

function loading(stream) {
  return _([{type: 'START_LOADING'}])
    .concat(stream)
    .append({type: 'STOP_LOADING'});
}
