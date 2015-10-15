var React = require('react');

var Page = require('components/page.jsx');
var Card = require('components/card.jsx');

module.exports = props =>
  <Page title="Invoices">
    <div className="row">
      <div className="one-quarter float-left padded">
        <a href="#/invoices/new">
          <Card className="card--dashed" head={<i className="fa fa-file-o fa-3x"/>}>
            <span>Create invoice ...</span>
          </Card>
        </a>
      </div>
      <div className="one-quarter float-left padded">
        <Invoice number={2}/>
      </div>
    </div>
  </Page>

function Invoice(props) {
  let head = (<i className="fa fa-file-o fa-3x"/>);

  return (
    <Card head={head} className="primary-border-color">
      <span>Nr. {props.number}</span>
    </Card>
  );
}
