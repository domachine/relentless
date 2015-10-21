var React = require('react');

module.exports = props =>
  <div className="toolbar toolbar--primary primary-background-color">
    <div className="container">
      <a href="#" className="site-logo primary-font inverse-color">
        DB
      </a>
      <a href="#/invoices" className="toolbar__item toolbar__item--primary inverse-color">
        Invoices
      </a>
      {props.children}
      <a href="#" className="toolbar__item toolbar__item--primary toolbar__item--right inverse-color">
        <i className="fa fa-cog"/>
      </a>
    </div>
  </div>
