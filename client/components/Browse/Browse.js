import 'babel-polyfill';
import Relay from 'react-relay';
import React from 'react';
import queryString from 'query-string';
import model from '../../helpers/model';
import navigation from '../../helpers/navigation';

require('./browse.css');

function Tag (props) {
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

function searchChanged(e) {
  let newQuery = { search: e.target.value };
  // sync state update required to avoid async text update issues
  model.setState({query: newQuery});
  // update url to reflect change.
  navigation.setQuery(newQuery);
}

function SearchBar(props) {
  return (
    <div className="ui fluid input focus search-bar">
      <input 
        autoFocus="true" 
        placeholder="search.." 
        onChange={searchChanged}
        value={props.search}
        type="text">
      </input>
    </div>
  );
}

function ItemsList(props) {
  return (
    <div className="ui list">
      {props.itemsList.items.edges.length === 0 && <h4 className="ui center aligned header"> sorry, no matching items found. </h4>}
      {props.itemsList.items.edges.map(function (edge) {
        return <Item item={edge.node} type='note' key={edge.node.id} />; 
      })}
    </div>
  );
}


ItemsList = Relay.createContainer(ItemsList, {
  initialVariables: {
    title: null
  },
  fragments: {
    itemsList: () => Relay.QL`
      fragment on ItemsList {
        items (first: 20, title: $title) {
          edges {
            node {
              id,
              ${Item.getFragment('item')},
            }
          }
        }
      }
    `
  }
});

class ItemsListRouteQuery extends Relay.Route {
  static routeName = 'ItemsListRouteQuery';
  static paramDefinitions = {
    title: {required: true},
  };
  static queries = {
    itemsList: function (Component, {title}) {
      return Relay.QL`
        query {
          itemsList { ${Component.getFragment('itemsList', {title}) } }
        }
      `;
    }
  };
}

function Browse(props) {
  return (
    <div className="ui main text container">
      <SearchBar {...props}/>           
      <Relay.RootContainer
        Component={ItemsList}
        route={new ItemsListRouteQuery({title: props.search})}
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
