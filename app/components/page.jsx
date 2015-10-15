var React = require('react');

var PrimaryToolbar = require('components/primary_toolbar.jsx');

module.exports = props =>
  <div>
    <PrimaryToolbar/>
    <div className="container">
      <h1 className="primary-headline primary-color primary-font">
        {props.title}
      </h1>
      {props.subtitle != null
        ? (
          <h2 className="secondary-headline primary-color primary-font">{props.subtitle}</h2>
        ) : null}
      {props.children}
    </div>
  </div>
