import React from 'react';

import Page from 'components/page.jsx';
import InvoiceForm from 'components/invoice_form.jsx';
var db = require('db');
var actions = require('actions');

var addLineItem = props => lineItem =>
  props.dispatch(actions.addEditingInvoiceLineItem(lineItem));

var destroyLineItem = props =>
  index =>
    props.dispatch(actions.destroyEditingInvoiceLineItem(index));

var update = props =>
  data =>
    props.dispatch(actions.updateEditingInvoice(data));

var save = props =>
  () => actions.saveInvoice(db, props.editingInvoice);

export default props =>
  <Page title={`Invoice ${props.editingInvoice._id.split(':')[1]}`}>
    <InvoiceForm
      invoice={props.editingInvoice}
      onAddLineItem={update(props)}
      onDestroyLineItem={destroyLineItem(props)}
      onUpdate={update(props)}
      onSave={save(props)}/>
  </Page>
