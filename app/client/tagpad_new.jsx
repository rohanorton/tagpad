import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

require('./tagpad.css');

class User extends React.Component {
  render() {
    var {email} = this.props.user; 
    return (
      <li>
        {email}
      </li>
    );
  }
}

User = Relay.createContainer(User, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        email
      }
    `
  }
});

class UserStore extends React.Component {
  render() {
    return <ul>
      {this.props.store.users.map(function (user) {
        return <User key={user.id} user={user} />;
      })}
    </ul>;
  }
}

UserStore = Relay.createContainer(UserStore, {
  fragments: {
    users: () => Relay.QL`
      users {
        id
        ${User.getFragment('user')}
      },
    `
  }
});

class UserHomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    store: (Component) => Relay.QL`
      query UserStoreQuery {
        store { ${Component.getFragment('store')} },  
      }
    `
  };
}

ReactDOM.render(
  <Relay.RootContainer
    Component={UserStore}
    route={new UserHomeRoute()}
  />,
  document.getElementById('react-container')
);

