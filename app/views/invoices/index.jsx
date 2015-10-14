var React = require('react');

var Page = require('views/layouts/page.jsx');

module.exports = props =>
  <Page title="Invoices">
    <div className="row">
      <div className="one-quarter float-left padded">
        <div className="card">
          <div className="card__head">
            <i className="fa fa-file-o fa-3x"/>
          </div>
          <div className="card__body">
            <h4>Nr. 2</h4>
          </div>
        </div>
      </div>
      <div className="one-quarter float-left padded">
        <div className="card">
          <div className="card__head">
            <i className="fa fa-file-o fa-3x"/>
          </div>
          <div className="card__body">
            <h4>Nr. 1</h4>
          </div>
        </div>
      </div>
      <div className="one-quarter float-left padded">
        <div className="card">
          <div className="card__head">
            <i className="fa fa-file-o fa-3x"/>
          </div>
          <div className="card__body">
            <h4>Nr. 1</h4>
          </div>
        </div>
      </div>
      <div className="one-quarter float-left padded">
        <div className="card">
          <div className="card__head">
            <i className="fa fa-file-o fa-3x"/>
          </div>
          <div className="card__body">
            <h4>Nr. 1</h4>
          </div>
        </div>
      </div>
      <div className="one-quarter float-left padded">
        <div className="card">
          <div className="card__head">
            <i className="fa fa-file-o fa-3x"/>
          </div>
          <div className="card__body">
            <h4>Nr. 1</h4>
          </div>
        </div>
      </div>
    </div>
  </Page>
