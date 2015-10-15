var React = require('react');

var Page = require('components/page.jsx');
var Card = require('components/card.jsx');

module.exports = props =>
  <Page title="Invoices">
    <div className="row">
      <div className="one-quarter float-left padded">
        <Invoice number={2}/>
      </div>
    </div>
  </Page>

function Invoice(props) {
  let head = (<i className="fa fa-file-o fa-3x"/>);

  return (
    <Card head={head}>
      <span>Nr. {props.number}</span>
    </Card>
  );
}
