var React = require('react');
var _ = require('highland');

var db = require('db');
var actions = require('actions');
var Page = require('components/page.jsx');
var InvoiceForm = require('components/invoice_form.jsx');

var addLineItem = props => lineItem =>
  props.dispatch(actions.addEditingInvoiceLineItem(lineItem));

var destroyLineItem = props =>
  index =>
    props.dispatch(actions.destroyEditingInvoiceLineItem(index));

var update = props =>
  data =>
    props.dispatch(actions.updateEditingInvoice(data));

var save = props =>
  () => props.dispatch(actions.createInvoice(db, props.editingInvoice));

module.exports = props =>
  <Page title="New Invoice">
    <InvoiceForm invoice={props.editingInvoice}
      onUpdate={update(props)}
      onAddLineItem={addLineItem(props)}
      onDestroyLineItem={destroyLineItem(props)}
      onSave={save(props)}/>
  </Page>
