import Router from 'routes';
import _ from 'highland';

import {db} from 'utils';
import DashboardShow from 'views/dashboard/show.jsx';
import InvoicesIndex from 'views/invoices/index.jsx';
import InvoicesEdit from 'views/invoices/edit.jsx';
import InvoicesNew from 'views/invoices/new.jsx';

var router = new Router();
export default router;

router.addRoute('/dashboard', params =>
  _(db.query('relentless/invoices-by-number'))
    .map(res => ({total_invoices: res.total_rows}))
    .append({_view: DashboardShow})
);

router.addRoute('/invoices', params =>
  _(db.query('relentless/invoices-by-number', {
    include_docs: true,
    descending: true
  }))
  .append({_view: InvoicesIndex})
);

router.addRoute('/invoices/new', params =>
  _(db.query('relentless/invoices-by-number', {descending: true}))
    .map(({rows}) =>
      (rows[0] || {key: 0}).key
    )
    .map(number => ({
      type: 'REPLACE_EDITING_INVOICE',
      editingInvoice: {
        _id: `de.domachine.invoice:${number + 1}`,
        type: 'invoice',
        lineItems: []
      }
    }))
    .append({_view: InvoicesNew})
);

router.addRoute('/invoices/:id/edit', params =>
  _(db.get('de.domachine.invoice:' + params.id))
    .map(res => ({editingInvoice: res}))
    .append({_view: InvoicesEdit})
);

router.addRoute('*', params => '#/dashboard');
