module.exports = (state, action) =>
  Object.keys(exports).reduce(
    (previous, key) => 
      ({... previous, [key]: exports[key](state[key], action)}),
    state
  );

exports.config = reducer({
  HYDRATE_CONFIG: (state, action) => action.config
});

exports.editingInvoice = reducer({
  HYDRATE_EDITING_INVOICE: (state, action) => action.invoice,
  UPDATE_EDITING_INVOICE: (state, action) => ({... state, ... action.data})
});

function reducer(map) {
  return (state, action) =>
    (map[action.type] || (state => state))(state, action);
}
