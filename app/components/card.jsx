var React = require('react');

var Card = module.exports = (props) =>
  <div className="card primary-border-color">
    <div className="card__head">
      {props.head}
    </div>
    <div className="card__body primary-border-color">
      <h4 className="card__title primary-font">
        {props.children.length > 1 ? props.children[0] : props.children}
      </h4>
      <span className="card__subtitle primary-font">
        {props.children.length > 1 ? props.children[1] : null}
      </span>
    </div>
  </div>
