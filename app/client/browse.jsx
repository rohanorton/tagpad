var items = [
  { id: 1, type: 'note', 'title': 'thoughts on life', 
    'description': 'What is the meaning of it all?', tags: [] },
  { id: 2, type: 'bookmark', 'title': 'google', 
    'description': 'this is a link to the popular search engine', tags: [] },
  { id: 3, type: 'note', 'title': 'Ideas about space',
    'description': 'How big is space really?', tags: [] },
  { id: 4, type: 'location', 'title': "Enid's",
      'description': 'At night a bar, during the day a delicious brunch spot.', tags: ['Fun'] }
];
var currentPage = "browse";

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
        <a className="header">{props.item.title}</a>
        <div className="description">{props.item.description}</div>
        <ItemTags tags={props.item.tags} />
      </div>
    </div>
  );
}

function ItemList(props) {
  return (
    <div className="ui list">
      {items.map(function (item) {
        return <Item item={item} key={item.id} />; 
      })}
    </div>
  );
}

function SearchBar(props) {
  return (
    <div className="ui fluid input">
      <input placeholder="Search.." type="text"></input>
    </div>
  );
}

function SearchableBrowseList(props) {
  return (
    <div className="ui main text container">
      <SearchBar />           
      <ItemList items={props.items} />           
    </div>
  );
}

function MenuBar(props) {
  return (
    <div className="ui fixed inverted menu">
      <div className="ui container">
        <a href="#" className="header item">
          <img className="logo" src="img/logo.png"></img>
          tagpad
        </a>
        <a href="#" className={"item " + (props.page === 'browse' ? 'active' : '')}>browse</a>
        <a href="#" className={"item " + (props.page === 'add' ? 'active' : '')}>add</a>
      </div>
    </div>
  );
}

function BrowsePage(props) {
  return (
    <div>
      <MenuBar page={currentPage}/>
      <SearchableBrowseList items={items} />
    </div>
  );
}

ReactDOM.render(
  <BrowsePage />,
  document.getElementById('react-container')
);
