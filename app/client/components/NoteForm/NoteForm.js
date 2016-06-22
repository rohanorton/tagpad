import React from 'react';
import Relay from 'react-relay';
import AddItemMutation from './../../mutations/AddItemMutation.js';
import notification from './../../helpers/notification.js';
import itemHelpers from './../../helpers/items.js';
import navigation from './../../helpers/navigation.js';

require('./style.css');

let Form = React.createClass({

  // props passed in so args such as prev props can be used
  getItem: function (props) {
    let item;
    if (this.state) {
      item = this.state;
    } else if (props.item) {
      item = props.item;
    } else {
      item = itemHelpers.getNewItem();
    }
    return item;
  },

  cancel: function (e) {
    e.preventDefault();
    // go back to the browse page.
    navigation.startNavigating('browse');
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
      this.setState({item});
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
  updateField: function(name, value) {
    var updated = Object.assign({}, this.getItem(this.props), {[name]:value});
    this.setState(updated);
  },
  updateTitle: function(e) {
    e.preventDefault();
    this.updateField('title', e.target.value);
  },
  updateContent: function(e) {
    e.preventDefault();
    this.updateField('content', e.target.value);
  },
  updateTags: function(e) {
    e.preventDefault();
    this.updateField('tags', e.target.value);
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
    let item = this.getItem(this.props);
    return (
        <form className="ui form" onSubmit={this.onSubmit} >
          <div className={"field required " + this.getFieldErrorClass('title')} >
            <label>title</label>
            <input
              value={item.title}
              onChange={this.updateTitle}
              autoFocus="true"
              ref="title"
              type="text" />
            {this.getErrorLabel('title')}
          </div>

          <div className={"field required " + this.getFieldErrorClass('content')}>
            <label>content</label>
            <textarea
              value={item.content}
              ref="content"
              onChange={this.updateContent}
              >
            </textarea>
            {this.getErrorLabel('content')}
          </div>

          <div className={"field" + this.getFieldErrorClass('tags')}>
            <label>tags</label>
            <input
              value={item.tags}
              onChange={this.updateTags}
              ref="tags"
              type="text" />
          </div>

          <label className="required-label">
          <span className="asterisk">*</span> required</label>
        
          <button type="submit" className="savebutton ui right floated primary button">
            save
          </button>
          <button
            className="ui right floated button"
            onClick={this.cancel}
            >
            cancel
          </button>
        </form>
    );
  }
});

Form = Relay.createContainer(Form, {
  fragments: {
    item: () => Relay.QL`
      fragment on Item {
        id
        title
        content
        tags
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
