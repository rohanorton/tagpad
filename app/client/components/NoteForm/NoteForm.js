import React from 'react';
import Relay from 'react-relay';
import AddItemMutation from './../../mutations/AddItemMutation.js';
import notification from './../../helpers/notification.js';
import itemHelpers from './../../helpers/items.js';
import navigation from './../../helpers/navigation.js';
import store from './../../helpers/model.js';

require('./style.css');

let Form = React.createClass({

  propTypes: {
    cancel: React.PropTypes.func.isRequired
  },
  
  // props passed in so args such as prev props can be used
  getItem: function (props) {
    let item;
    if (props.mode === 'add') {
      item = props.newItem;
    } else {
      item = props.item;
    }
    return item;
  },

  onSubmit: function (e) {
    e.preventDefault();
    let item = this.getItem(this.props);
    itemHelpers.validate(item);
    if (Object.keys(item.errors).length === 0) {
      notification.loading("Adding...");
      Relay.Store.commitUpdate(
        new AddItemMutation({item, itemsListId: this.props.itemsList.id}),
        { 
          onSuccess: function (reponse) {
            notification.success("Item added");
          },
          onFailure: function (transaction) {
            let error = transaction.getError();
            let message = 'Add item failed';
            if (error) {
              message = _.get(error, 'source.errors[0].message');
              if (!message) {
                message = error.statusText; 
              }
            }
            notification.error("Error adding item", message);
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
    let item = this.getItem(this.props);
    var errors = item.errors || {};
    var prevErrors = this.getItem(prevProps).errors;
    var fieldsWithError = Object.keys(errors);
    // only focus is the errors are different, otherwise just typing shifts focus to the error field
    if (this.isMounted && errors && (errors !== prevErrors) && fieldsWithError.length) {
      this.refs[fieldsWithError[0]].focus();
    }
  },

  createUpdateField: function(fieldName) {
    let item = this.getItem(this.props);
    return function (e) {
      var changes = {};
      e.preventDefault();
      changes[fieldName] = e.target.value;
      var updated = Object.assign({}, item, changes);
      store.setState({ newItem: updated });
    };
  },

  getFieldErrorClass: function (fieldName) {
    let item = this.getItem(this.props);
    var areErrors = item.errors && item.errors[fieldName];
    return (areErrors ? 'error': '');
  },

  getErrorLabel: function (fieldName){
    let item = this.getItem(this.props);
    var msg = item.errors && item.errors[fieldName];
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
    let item = this.getItem(props);
    return (
        <form className="ui form" onSubmit={this.onSubmit} >
          <div className={"field required " + this.getFieldErrorClass('title')} >
            <label>title</label>
            <input
              value={item.title}
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
              value={item.content}
              ref="content"
              onChange={this.createUpdateField('content')}
              >
            </textarea>
            {this.getErrorLabel('content')}
          </div>

          <div className={"field" + this.getFieldErrorClass('tags')}>
            <label>tags</label>
            <input
              value={item.tags}
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
    );
  }
});


/*Form = Relay.createContainer(Form, {
  fragments: {
    itemsList: () => Relay.QL`
      fragment on ItemsList {
        id
      }
    `
  }
});*/

Form = Relay.createContainer(Form, {
  fragments: {
    item: () => Relay.QL`
      fragment on Item {
        id
        title
        content
      }
    `,
    itemsList: () => Relay.QL`
      fragment on ItemsList {
        id
      }
    `
  }
});

// Return the itemsList id as we want to invalidate the items list from cache
// on mutation success and need the id to do this.
class NoteFormRouteQuery extends Relay.Route {
  static routeName = 'NoteFormRouteQuery';
  static paramDefinitions = {
    itemId: {required: true},
  };
  static queries = {
    item: function (Component) {
      return Relay.QL`
        query {
          item(id: $itemId) { ${Component.getFragment('item')} }
        }
      `;
    },
    itemsList: function (Component) {
      return Relay.QL`
        query {
          itemsList { ${Component.getFragment('itemsList')} }
        }
      `;
    }
  };
}

function NoteForm(props) {
  return (
    <div className="ui main text container">
      <Relay.RootContainer
        Component={Form}
        route={new NoteFormRouteQuery({itemId: props.itemId})}
        renderFetched={function (data) {
          return <Form {...data} {...props} />
        }}
        renderLoading={function () {
          return (
            <div className="ui active loader text">loading item</div>
          );
        }}
        renderFailure={function(error, retry) {
          return (
            <div>
              <p>{error.message}</p>
              <p><button onClick={retry}>Retry?</button></p>
            </div>
          );
        }}
      />
    </div>
  );
}

module.exports = NoteForm;
