var React = require('react');
var uuid = require('uuid');
var _ = require('highland');
var merge = require('merge');

var db = require('db');
var actions = require('actions');
var Page = require('components/page.jsx');

var addLineItem = (props) =>
  e => {
    e.preventDefault();
    let lineItem = {
      _id: uuid.v4(),
      amount: 1
    };
    props.dispatch(actions.updateEditingInvoice({
      ... props.editingInvoice,
      lineItems: props.editingInvoice.lineItems.concat(lineItem)
    }));
  };

var destroyLineItem = index =>
  e => {
    e.preventDefault();
    props.dispatch(actions.destroyEditingInvoiceLineItem(index));
  };

var inputField = (props, field) => ({
  onChange(e) {
    props.dispatch(actions.updateEditingInvoice(
      merge.recursive(
        props.editingInvoice,
        field.split('.')
          .reverse()
          .reduce((obj, key) => ({
            [key]: obj
          }), e.target.value)
      )
    ));
  },

  value: field.split('.')
    .reduce((value, key) => (value || {})[key] || '', props.editingInvoice)
});

var lineItemInputField = (props, index, field) => ({
  onChange(e) {
    props.dispatch(actions.updateEditingInvoice({
      ... props.editingInvoice,
      lineItems: props.editingInvoice.lineItems.map((lineItem, i) =>
        i === index
          ? {... lineItem, [field]: e.target.value}
          : lineItem
      )
    }))
  },

  value: props.editingInvoice.lineItems[index][field] || ''
});

module.exports = props =>
  <Page title="New Invoice">
    <div className="invoice">
      <div className="invoice__address">
        <div className="invoice__address-note-space">
          <span>Dominik Burgdörfer - Anne-Frank-Weg 14, 89075 Ulm</span>
        </div>
        <div className="invoice__address-space">
          <input type="text" className="invoice__input invoice__input--address inverse-background-color" placeholder="Name" {... inputField(props, 'customer.name')}/>
          <input type="text" className="invoice__input invoice__input--address inverse-background-color" placeholder="Street address" {... inputField(props, 'customer.streetAddress')}/>
          <input type="text" className="invoice__input invoice__input--address inverse-background-color" placeholder="Postalcode" {... inputField(props, 'customer.postalCode')}/>
          <input type="text" className="invoice__input invoice__input--address inverse-background-color" placeholder="Address locality" {... inputField(props, 'customer.addressLocality')}/>
        </div>
      </div>
      <div className="invoice__from-address">
        Dominik Burgdörfer
        <p/>
        Telefon: 1234<br/>
        E-Mail: db@domachine.de
        <p/>
        Datum: 09.08.2015
      </div>
      <div className="invoice__body">
        <h4>Rechnung Nr {props.editingInvoice._id.split(':')[1]}.</h4>
        <textarea className="invoice__input inverse-background-color" rows={5} placeholder="Message ..." {... inputField(props, 'message')}/>
        <table className="invoice__table">
          <thead>
            <tr>
              <th className="text-center" style={{width: '20%'}}>Anzahl</th>
              <th className="text-center" style={{width: '30%'}}>Produkt</th>
              <th className="text-right" style={{width: '20%'}}>Einzelpreis</th>
              <th className="text-right" style={{width: '20%'}}>Gesamtpreis</th>
              <th style={{width: '10%'}}></th>
            </tr>
          </thead>
          <tbody>
            {props.editingInvoice.lineItems.map((lineItem, i) =>
              <tr key={lineItem._id} className="invoice__table-row">
                <td className="invoice__table-cell text-center">
                  <input className="invoice__input text-center" type="number" {... lineItemInputField(props, i, 'amount')}/>
                </td>
                <td className="invoice__table-cell text-center">
                  <input className="invoice__input text-center" type="text" {... lineItemInputField(props, i, 'product')}/>
                </td>
                <td className="invoice__table-cell price">
                  <input className="invoice__input invoice__input--price" type="number" {... lineItemInputField(props, i, 'price')}/>
                </td>
                <td className="invoice__table-cell price">
                  300,00
                </td>
                <td className="invoice__table-cell text-right">
                  <button className="btn btn--round btn--small secondary-background-color inverse-color" onClick={destroyLineItem(i)}>
                    <i className="fa fa-close"/>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="btn btn--round btn--small primary-background-color inverse-color" onClick={addLineItem(props)}>
          <i className="fa fa-plus"/>
        </button>
      </div>
      <footer className="invoice__footer">
        <div className="one-half float-left">
          Dominik Burgdörfer<br/>
          Anne-Frank-Weg 14<br/>
          89075 Ulm
        </div>
        <div className="one-half float-left">
          Steuernummer: 1234<br/>
        </div>
      </footer>
      <div className="invoice__toolbar toolbar toolbar--secondary toolbar--sticky success-background-color">
        <button className="toolbar__item toolbar__item--btn toolbar__item--center inverse-color" onClick={e => props.dispatch(actions.createInvoice(db, props.editingInvoice))}>
          <i className="fa fa-save fa-2x"/>
        </button>
      </div>
    </div>
  </Page>
