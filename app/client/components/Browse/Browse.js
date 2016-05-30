import 'babel-polyfill';
import Relay from 'react-relay';
import React from 'react';

require('./browse.css');

function Tag(props) {
  return <a className="ui label">{props.name}</a>
}

function ItemTags(props) {
  return (
    <div className="right ui labels">
      {props.tags.map(function (tagName, index) {
        return <Tag key={index} name={tagName} />;
      })}
    </div>
  );
}

function Item(props) {
  var typeToClass = {
    'note' : "file text outline icon",
    'bookmark': "bookmark outline icon",
    'location': "map marker icon"
  };
  return (
    <div className="item">
      <i className={typeToClass[props.type]}></i>
      <div className="content">
        <a href={"#/items/" + props.id} className="header">{props.title}</a>
        <div className="description">{props.content}</div>
        <ItemTags tags={props.tags || []} />
      </div>
    </div>
  );
}

/*Item = Relay.createContainer(Item, {
  fragments: {
    item: () => Relay.QL`
      fragment on Item {
        title,
        content
      }
    `
  }
});*/

Item.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  content: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired
};


function SearchBar(props) {
  return (
    <div className="ui fluid input focus search-bar">
      <input autoFocus="true" placeholder="Search.." type="text"></input>
    </div>
  );
}

function ItemList(props) {
console.log('item list props = ', props);
  return (
    <div className="ui list">
      {props.itemsList.items.map(function (item) {
        return <Item {...item} type='note' key={item.id} />; 
      })}
    </div>
  );
}

ItemList = Relay.createContainer(ItemList, {
  fragments: {
    itemsList: () => Relay.QL`
      fragment on ItemsList {
        items {
          id,
          title,
          content
        }
      }
    `
  }
});

class ItemListRouteQuery extends Relay.Route {
  static routeName = 'ItemListRouteQuery';
  static queries = {
    itemsList: (Component) => Relay.QL`
      query {
        itemsList { ${Component.getFragment('itemsList')} },
      }
    `,
  };
}
function Browse(props) {
  return (
    <div className="ui main text container">
      <SearchBar />           
      <Relay.RootContainer
        Component={ItemList}
        route={new ItemListRouteQuery()}
        renderLoading = {function () {
          return <div> Loading... </div>
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

module.exports = Browse;
