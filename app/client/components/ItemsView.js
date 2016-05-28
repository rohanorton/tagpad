import 'babel-polyfill';
import Relay from 'react-relay';
var React = require('react');

// Some components
var Menu = require('./Menu/Menu.js');
var Browse = require('./Browse/Browse.js');

/*var NoteForm = require('./NoteForm/NoteForm.jsx');
var Login = require('./Login/Login.jsx');
var itemActions = require('./../actions/items.js');*/

function NotFound() {
  return (
    <div className="ui main text container">
      <h1 className="ui header"> Not Found </h1>
      <a href="#/browse">go back to browse page</a>
    </div>
  );
}


// object which represents item whilst being edited.
function getItemForm (state, id) {
  // use one we are editing already, if we aren't already editing then get the existing item.
  var itemForm = state.itemForms[id];
  if (!itemForm) { 
    itemForm = state.items.filter(function(item) { return item.id === id; })[0];
  }
  return itemForm;
}

function loginSubmit(e) {
  e.preventDefault();
  alert('loginSubmit, value = ' + JSON.stringify(e.target.value));
}

// Appplication is just browse for now.
class ItemsView extends React.Component {
  render() {
    let items = this.props.itemsView.items;
    return (
      <div>
        <Menu page="browse" />
        <Browse items={items} />;
      </div>
    );
  }
}

export default Relay.createContainer(ItemsView, {
  fragments: {
    itemsView: () => Relay.QL`
      fragment on ItemsView {
        items {
          id,
          title,
          content,
        },
      }
    `,
  },
});


// Appplication is just browse for now bring this back soon.
/*module.exports = function Application (props) {
  let page = props.location[0];

  if (page === "login") {
    return <Login onSubmit={loginSubmit}/>;
  } else if (page === "browse") {
    return (
      <div>
        <Menu page={page} />
        <Browse {...props} />;
      </div>
    );
  } else if (page === "add") {
    return (
      <div>
        <Menu page={page} />
        <NoteForm 
          item={props.newItem}
          submit={itemActions.submitNewItem} 
          update={itemActions.updateNewItem} 
          cancel={itemActions.cancel}
        />;
      </div>
    );
  } else if (page === "items") {
    if (props.location.length === 2) {
      let id = Number(props.location[1]);
      let item = getItemForm(props, id);
      if (item) {
        return (
          <div>
            <Menu page={page} />
            <NoteForm
              item={item}
              submit={itemActions.submitItemForm}
              update={itemActions.updateItemForm}
              cancel={itemActions.cancel}
            />;
          </div>
        );
      }
    }
  } 
  return <NotFound />;

};*/
