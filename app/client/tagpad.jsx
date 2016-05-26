
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class User extends React.Component {
  render() {
    var {email, id} = this.props.user;
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
        id,
        email
      }
    `,
  },
});

class UserList extends React.Component {
  render() {
    return <ul>
      {this.props.root.users.map(function (user) {
        return <User key={user.id} user={user} />;
      })}
    </ul>;
  }
}

UserList = Relay.createContainer(UserList, {
  fragments: {
    root: () => Relay.QL`
      fragment on Root {
        users {
          id
          ${User.getFragment('user')} 
        },
      }
    `,
  },
});

class UserHomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    root: (Component) => Relay.QL`
      query UserListQuery {
        root { ${Component.getFragment('root')} },
      }
    `,
  };
}

ReactDOM.render(
  <Relay.RootContainer
    Component={UserList}
    route={new UserHomeRoute()}
  />,
  document.getElementById('react-container')
);
