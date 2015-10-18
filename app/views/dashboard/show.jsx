var React = require('react');

var Page = require('components/page.jsx');
var Card = require('components/card.jsx');

module.exports = (props) =>
  <Page title="Hello!" subtitle="I hope, you have a wonderful day!">
    <div className="primary-content">
      <div className="one-half float-left">
        <div className="one-half push-one-quarter">
          <Card head={<div className="counter secondary-color">2</div>}>
            <a href="#" className="primary-color">
              Customers
            </a>
            <span>total</span>
          </Card>
        </div>
      </div>
      <div className="one-half float-left">
        <div className="one-half push-one-quarter">
          <Card head={<div className="counter secondary-color">14</div>}>
            <a href="#/invoices" className="primary-color">
              Invoices
            </a>
            <span className="success-color">13 paid</span>
          </Card>
        </div>
      </div>
    </div>
  </Page>
