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
      .map(res => window.location.href = `#/invoices/${res.id}`)
  );

exports.updateEditingInvoice = data => _([{
  type: 'UPDATE_EDITING_INVOICE',
  data
}]);

function loading(stream) {
  return _([{type: 'START_LOADING'}])
    .concat(stream)
    .append({type: 'STOP_LOADING'});
}
