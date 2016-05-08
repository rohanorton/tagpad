function Add(props) {
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
