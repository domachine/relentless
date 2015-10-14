var React = require('react');

module.exports = props =>
  <div className="primary-toolbar primary-background-color">
    <div className="container">
      <a href="#" className="primary-toolbar__logo primary-font inverse-color">
        DB
      </a>
      <a href="#/invoices" className="primary-toolbar__item inverse-color">
        Invoices
      </a>
    </div>
  </div>
