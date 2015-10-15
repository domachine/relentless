var _ = require('highland');

exports.fetchConfig = (db) =>
  openDoc(db, 'config')
    .map(config =>
      ({type: 'HYDRATE_CONFIG', config})
    )

var openDoc = _.wrapCallback((db, id, next) => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `/${db}/${id}`);
  xhr.onload = () => {
  };
});
