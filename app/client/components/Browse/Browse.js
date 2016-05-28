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
      <i className={typeToClass[props.type]}></i>
      <div className="content">
        <a href={"#/items/" + props.id} className="header">{props.title}</a>
        <div className="description">{props.content}</div>
        <ItemTags tags={props.tags || []} />
      </div>
    </div>
  );
}

Item.propTypes = {
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  content: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired
};

function ItemList(props) {
  return (
    <div className="ui list">
      {props.items.map(function (item) {
        console.log('item = ', item);
        return <Item {...item} type='note' key={item.id} />; 
      })}
    </div>
  );
}

function SearchBar(props) {
  return (
    <div className="ui fluid input focus search-bar">
      <input autoFocus="true" placeholder="Search.." type="text"></input>
    </div>
  );
}

function Browse(props) {
  return (
    <div className="ui main text container">
      <SearchBar />           
      <ItemList items={props.items} />           
    </div>
  );
}

Browse.propTypes = {
  items: React.PropTypes.array.isRequired
};

module.exports = Browse;
