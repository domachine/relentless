var React = require('react');
var _ = require('highland');

var utils = require('utils');
var Page = require('components/page.jsx');
var Card = require('components/card.jsx');

module.exports = class InvoicesIndex extends React.Component {
  constructor(props) {
    super();
    this.state = {
      invoices: props.rows.map(r => r.doc)
    };
  }

  componentDidMount() {
    this.changes = utils.db.changes({
      since: this.props.update_seq,
      filter: '_view',
      view: 'relentless/invoices-by-number',
      live: true
    });
    _('change', this.changes)
      .flatMap(() =>
        _(utils.db.query('relentless/invoices-by-number', {
          include_docs: true,
          descending: true
        }))
      )
      .each(({rows}) => {
        this.setState({invoices: rows.map(r => r.doc)})
      });
  }

  componentWillUnmount() {
    this.changes.cancel();
  }

  render() {
    return (
      <Page title="Invoices">
        <div className="row">
          <div className="one-quarter float-left padded">
            <a href="#/invoices/new">
              <Card className="card--dashed" head={<i className="fa fa-file-o fa-3x"/>}>
                <span>Create invoice ...</span>
              </Card>
            </a>
          </div>
          {this.state.invoices.map(invoice =>
            <div key={invoice._id} className="one-quarter float-left padded">
              <Invoice number={invoice._id.split(':')[1]}/>
            </div>
          )}
        </div>
      </Page>
    );
  }
}

var Invoice = props => {
  let head = (<i className="fa fa-file-o fa-3x"/>);

  return (
    <Card head={head} className="primary-border-color">
      <a href={`#/invoices/${props.number}/edit`}>Nr. {props.number}</a>
    </Card>
  );
}
