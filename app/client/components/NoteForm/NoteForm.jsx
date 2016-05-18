var React = require('react');
require('./style.css');

module.exports = React.createClass({

  propTypes: {
    newItem: React.PropTypes.object.isRequired,
    updateNewItem: React.PropTypes.func.isRequired,
    submitNewItem: React.PropTypes.func.isRequired
  },

  componentDidUpdate: function(prevProps) {
    var errors = this.props.newItem.errors || {};
    var prevErrors = prevProps.newItem.errors;
    var fieldsWithError = Object.keys(errors);
    // only focus is the errors are different, otherwise just typing shifts focus to the error field
    if (this.isMounted && errors && (errors !== prevErrors) && fieldsWithError.length) {
      this.refs[fieldsWithError[0]].focus();
    }
  },

  createUpdateField: function(fieldName) {
    let props = this.props;
    return function (e) {
      var changes = {};
      e.preventDefault();
      changes[fieldName] = e.target.value;
      var updated = Object.assign({}, props.newItem, changes);
      props.updateNewItem(updated);
    };
  },

  getFieldErrorClass: function (fieldName) {
    var areErrors = this.props.newItem.errors && this.props.newItem.errors[fieldName];
    return (areErrors ? 'error': '');
  },

  getErrorLabel: function (fieldName){
    var msg = this.props.newItem.errors && this.props.newItem.errors[fieldName];
    if (msg) {
      return (
        <div className="ui pointing red basic label">
          {msg}
        </div>
      );
    } else {
      return null;
    }
  },

  render: function () {
    let props = this.props;
    return (
      <div className="ui main text container">
        <form className="ui form" onSubmit={props.submitNewItem} >
          <div className={"field required " + this.getFieldErrorClass('title')} >
            <label>title</label>
            <input
              value={props.newItem.title}
              onChange={this.createUpdateField('title')}
              autoFocus="true"
              ref="title"
              type="text">
            </input>
            {this.getErrorLabel('title')}
          </div>
          <div className={"field required " + this.getFieldErrorClass('description')}>
            <label>content</label>
            <textarea
              value={props.newItem.description}
              ref="description"
              onChange={this.createUpdateField('description')}
              >
            </textarea>
            {this.getErrorLabel('description')}
          </div>
          <div className={this.getFieldErrorClass('tags')}>
            <label>tags</label>
            <input
              value={props.newItem.tags}
              onChange={this.createUpdateField('tags')}
              type="text">
            </input>
          </div>
          <label className="required-label"><span className="asterisk">*</span> required</label>
          <button type="submit" className="savebutton ui right floated primary button">
            save
          </button>
          <button
            className="ui right floated button"
            onClick={props.cancel}
            >
            cancel
          </button>
        </form>
      </div>
    );
  }
});
