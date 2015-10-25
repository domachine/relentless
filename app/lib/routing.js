import _ from 'highland';
import _Router from 'routes';

import Event from './event';

var stream = _(push => {
  var trigger = window.onhashchange = () => push(null, window.location.hash);
  trigger();
}).map(hash => (hash || '#').slice(1))
  .map(hash => new Event('LOCATION_CHANGE', hash));

var toRouter = routes =>
  routes.reduce((router, route) => {
    router.addRoute(route[0], route[1]);
    return router;
  }, _Router());

var Router = routes => {
  let router = toRouter(routes);
  return hash =>
    _([router.match(hash)])
      .map(m => m.fn(m.params))
      .flatMap(r => _.isStream(r) ? r : _([r]))
};

export {stream, Router}
