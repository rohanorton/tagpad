import 'babel-polyfill';
import Relay from 'react-relay';
import React from 'react';
import queryString from 'query-string';

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
  var item = props.item;
  return (
    <div className="item">
      <i className={typeToClass[item.type]}></i>
      <div className="content">
        <a href={"#/items/" + item.id} className="header">{item.title}</a>
        <div className="description">{item.content}</div>
        <ItemTags tags={item.tags || []} />
      </div>
    </div>
  );
}

Item = Relay.createContainer(Item, {
  fragments: {
    item: () => Relay.QL`
      fragment on Item {
        id,
        title,
        content
      }
    `
  }
});

let SearchBar = React.createClass({
  setSearch: function (e) {
    var oldHash = window.location.hash;
    let newHash;
    if (oldHash.indexOf('?')) {
      newHash = oldHash.split('?')[0];
    } else {
      newHash = oldHash;
    }
    newHash += '?' + queryString.stringify({search: e.target.value}); 
    window.location.hash = newHash;
  },
  render: function () {
    return (
      <div className="ui fluid input focus search-bar">
        <input 
          autoFocus="true" 
          placeholder="search.." 
          onChange={this.setSearch}
          value={this.props.search}
          type="text">
      </input>
      </div>
    );
  }
});

function ItemList(props) {
  return (
    <div className="ui list">
      {props.itemsList.items.length === 0 && <h4 className="ui center aligned header"> sorry, no matching items found. </h4>}
      {props.itemsList.items.map(function (item) {
        return <Item item={item} type='note' key={item.id} />; 
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
          ${Item.getFragment('item')},
        }
      }
    `
  }
});

class ItemListRouteQuery extends Relay.Route {
  static routeName = 'ItemListRouteQuery';
  static paramDefinitions = {
    title: {required: true},
  };
  static queries = {
    itemsList: (Component) => Relay.QL`
      query {
        itemsList(title: $title) { ${Component.getFragment('itemsList')} },
      }
    `,
  };
}

function Browse(props) {
  return (
    <div className="ui main text container">
      <SearchBar search={props.search}/>           
      <Relay.RootContainer
        Component={ItemList}
        route={new ItemListRouteQuery({title: props.search})}
        renderLoading = {function () {
          return (
            <div className="ui active loader text">loading items</div>
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

module.exports = Browse;
