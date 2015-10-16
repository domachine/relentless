module.exports = (state, action) =>
  [
    'config'
  ].reduce(
    (previous, key) => 
      ({... previous, [key]: exports[key](state[key], action)}),
    state
  )

exports.config = (state, action) =>
  ({
    HYDRATE_CONFIG: (state, action) => action.config
  })[action.type](state, action);
