function Menu(props) {
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

