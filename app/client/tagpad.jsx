
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

class Item extends React.Component {
  render() {
    var {title, id} = this.props.item;
    return (
      <li>
        {title}
      </li>
    );
  }
}
Item = Relay.createContainer(Item, {
  fragments: {
    item: () => Relay.QL`
      fragment on Item {
        id,
        title
      }
    `,
  },
});



class ItemsView extends React.Component {
  render() {
    return <ul>
      {this.props.itemsView.items.map(function (item) {
        return <Item key={item.id} item={item} />;
      })}
    </ul>;
  }
}

ItemsView = Relay.createContainer(ItemsView, {
  fragments: {
    itemsView: () => Relay.QL`
      fragment on ItemsView {
        items {
          id
          ${Item.getFragment('item')} 
        },
      }
    `,
  },
});


class ItemsViewRoute extends Relay.Route {
  static routeName = 'Browse';
  static queries = {
    itemsView: (Component) => Relay.QL`
      query ItemsViewQuery {
        itemsView { ${Component.getFragment('itemsView')} },
      }
    `,
  };
}

ReactDOM.render(
  <Relay.RootContainer
    Component={ItemsView}
    route={new ItemsViewRoute()}
  />,
  document.getElementById('react-container')
);
