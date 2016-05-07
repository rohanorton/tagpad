
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

function ItemForm(props) {
  return (
    <div className="ui main text container">
      <div className="ui form">
        <div className="field">
          <label>title</label>
          <input placeholder="title" type="text"></input>
        </div>
        <div className="field">
          <label>content</label>
          <textarea placeholder="content"></textarea>
        </div>
        <div className="field">
          <label>tags</label>
          <input placeholder="tags" type="text"></input>
        </div>
        <button className="savebutton ui right floated primary button">
          save
        </button>
        <button className="ui right floated button">
          cancel
        </button>
      </div>
    </div>
  );
}

function AddPage(props) {
  return (
    <div>
      <MenuBar page="add"/>
      <ItemForm />
    </div>
  );
}

ReactDOM.render(
  <AddPage />,
  document.getElementById('react-container')
);
