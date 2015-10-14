var React = require('react');

var Page = require('views/layouts/page.jsx');
var Card = require('components/card.jsx');

module.exports = (props) =>
  <Page title="Hello!" subtitle="I hope, you had a wonderful day!">
    <div className="primary-content">
      <div className="one-half float-left">
        <Card counter="2">
          <a href="#" className="primary-color">
            Customers
          </a>
          <span>total</span>
        </Card>
      </div>
      <div className="one-half float-left">
        <Card counter="14">
          <a href="#/invoices" className="primary-color">
            Invoices
          </a>
          <span className="success-color">13 paid</span>
        </Card>
      </div>
    </div>
  </Page>
