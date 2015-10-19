var _ = require('highland');
var utils = require('utils');

module.exports = router => ({
  stream: _(push => {
      window.onhashchange = () =>
        push(null, (window.location.hash || '#').slice(1));
      push(null, (window.location.hash || '#').slice(1));
    })
    .map(url => router.match(url))
    .flatMap(match =>
      match == null

        // Setting the view to null, so that the consumer can react to a 404.
        ? _([{View: null}])
        : _(utils.db.info())
            .concat(
              match.fn(match.params)
              .reduce({}, (state, action) => ({... state, ... action}))
            )
    )
});
