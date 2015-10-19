exports._id = '_design/relentless';
exports.version = '0.0.1';

exports.views = {
  'invoices-by-number': {
    map: doc =>
      doc.type === 'invoice'
        ? emit(parseInt(doc._id.split(':')[1]), null)
        : null
  }
}
