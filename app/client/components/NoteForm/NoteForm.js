import React from 'react';
import Relay from 'react-relay';

var itemHelpers = require('./../../helpers/items.js');
var store = require('./../../helpers/model.js');
require('./style.css');


class AddItemMutation extends Relay.Mutation {
  getVariables() {
    // server can decide how to handle this.
    return {
      foo: 'bar'
    }
  }
  // this stuff that might change.
  getFatQuery() {
    return Relay.QL`
      fragment on AddItemPayload {
        itemList
      }
    `
  }
   // These configurations advise Relay on how to handle the Payload
  // returned by the server. Here, we tell Relay to use the payload to
  // change the fields of a record it already has in the store. The
  // key-value pairs of ‘fieldIDs’ associate field names in the payload
  // with the ID of the record that we want updated.
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        itemList: {id: '1'}
      }
    }];
  }
  getMutation() {
    return Relay.QL`mutation { addItem }`;
  }
}


module.exports = React.createClass({

  propTypes: {
    item: React.PropTypes.object.isRequired,
    cancel: React.PropTypes.func.isRequired
  },

  componentDidUpdate: function(prevProps) {
    var errors = this.props.item.errors || {};
    var prevErrors = prevProps.item.errors;
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
      var updated = Object.assign({}, props.item, changes);
      store.setState({ newItem: updated });
    };
  },

  getFieldErrorClass: function (fieldName) {
    var areErrors = this.props.item.errors && this.props.item.errors[fieldName];
    return (areErrors ? 'error': '');
  },

  getErrorLabel: function (fieldName){
    var msg = this.props.item.errors && this.props.item.errors[fieldName];
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

  onSubmit: function (e) {
    e.preventDefault();
    let item = this.props.item;
    itemHelpers.validate(item);
    
    store.setState({ newItem: item });
    if (Object.keys(item.errors).length === 0) {
      Relay.Store.commitUpdate(
        new AddItemMutation({someData: 'blah'})
      )
    } else {
      alert('cant submit item, there was errors: ' + JSON.stringify(item.errors));
    }
  },

  render: function () {
    let props = this.props;
    return (
      <div className="ui main text container">
        <form className="ui form" onSubmit={this.onSubmit} >
          <div className={"field required " + this.getFieldErrorClass('title')} >
            <label>title</label>
            <input
              value={props.item.title}
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
              value={props.item.description}
              ref="description"
              onChange={this.createUpdateField('description')}
              >
            </textarea>
            {this.getErrorLabel('description')}
          </div>

          <div className={"field" + this.getFieldErrorClass('tags')}>
            <label>tags</label>
            <input
              value={props.item.tags}
              onChange={this.createUpdateField('tags')}
              type="text">
            </input>
          </div>

          <label className="required-label">
          <span className="asterisk">*</span> required</label>
        
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
