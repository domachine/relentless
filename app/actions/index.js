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
    )
