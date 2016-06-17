import React from 'react';
import Relay from 'react-relay';
import AddItemMutation from './../../mutations/AddItemMutation.js';
import notification from './../../helpers/notification.js';
import itemHelpers from './../../helpers/items.js';
import navigation from './../../helpers/navigation.js';
import store from './../../helpers/model.js';

require('./style.css');

module.exports = React.createClass({

  propTypes: {
    item: React.PropTypes.object.isRequired,
    cancel: React.PropTypes.func.isRequired
  },

  onSubmit: function (e) {
    e.preventDefault();
    let item = this.props.item;
    itemHelpers.validate(item);
    if (Object.keys(item.errors).length === 0) {
      notification.info("Adding...");
      Relay.Store.commitUpdate(
        new AddItemMutation({item, itemListId: '1'}),
        { 
          onSuccess: function (reponse) {
            notification.info("Item added");
          },
          onFailure: function (transaction) {
            notification.error("Error adding item");
          }
        }
      );
      navigation.startNavigating('browse'); 
    } else {
      // render the errors.
      store.setState({ newItem: item });
    }
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
          <div className={"field required " + this.getFieldErrorClass('content')}>
            <label>content</label>
            <textarea
              value={props.item.content}
              ref="content"
              onChange={this.createUpdateField('content')}
              >
            </textarea>
            {this.getErrorLabel('content')}
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
