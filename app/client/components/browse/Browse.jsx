var React = require('react');
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
      <i className={typeToClass[props.item.type]}></i>
      <div className="content">
        <a href={"#/items/" + props.item.id} className="header">{props.item.title}</a>
        <div className="description">{props.item.description}</div>
        <ItemTags tags={props.item.tags} />
      </div>
    </div>
  );
}

function ItemList(props) {
  return (
    <div className="ui list">
      {props.items.map(function (item) {
        return <Item item={item} key={item.id} />; 
      })}
    </div>
  );
}

function SearchBar(props) {
  return (
    <div className="ui fluid input focus">
      <input autoFocus="true" placeholder="Search.." type="text"></input>
    </div>
  );
}

module.exports = function Browse(props) {
  return (
    <div className="ui main text container">
      <SearchBar />           
      <ItemList items={props.items} />           
    </div>
  );
};

module.exports.propTypes = {
  items: React.PropTypes.array.isRequired
};
