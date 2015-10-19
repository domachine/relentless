module.exports = (state, action) =>
  Object.keys(exports).reduce(
    (previous, key) =>
      ({... previous, [key]: exports[key](state[key], action)}),
    state
  );

exports.config = reducer({}, {
  HYDRATE_CONFIG: (state, action) => action.config
});

exports.editingInvoice = reducer({lineItems: []}, {
  HYDRATE_EDITING_INVOICE: (state, action) => action.invoice,
  UPDATE_EDITING_INVOICE: (state, action) => ({... state, ... action.data}),
  ADD_EDITING_INVOICE_LINE_ITEM: (state, action) =>
    ({... state, lineItems: [... state.lineItems, action.data]}),
  DESTROY_EDITING_INVOICE_LINE_ITEM: (state, action) => ({
    ... state,
    lineItems: state.lineItems.filter((item, index) => index !== action.index)
  }),
  UPDATE_EDITING_INVOICE_LINE_ITEM: (state, action) => ({
    ... state,
    lineItems: state.lineItems.map((lineItem, i) =>
      i === action.index
        ? {... lineItem, ... action.data}
        : lineItem
    )
  })
});

function reducer(def, map) {
  return (state = def, action) =>
    (map[action.type] || (state => state))(state, action);
}
