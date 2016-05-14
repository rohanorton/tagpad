var React = require('react');
var actions = require("../../store/actions.js");
require('./add.css');

module.exports = function Add(props) {
  
  function createUpdateField(fieldName) {
    return function (e) {
      var changes = {};
      e.preventDefault();
      changes[fieldName] = e.target.value;
      var updated = Object.assign({}, props.state.newItem, changes);
      actions.updateNewItem(updated);
    };
  }

  return (
    <div className="ui main text container">
      <form className="ui form" onSubmit={actions.submitNewItem} >
        <div className="field">
          <label>title</label>
          <input 
            placeholder="title" 
            value={props.state.newItem.title}
            onChange={createUpdateField('title')}
            type="text">
          </input>
        </div>
        <div className="field">
          <label>content</label>
          <textarea 
            value={props.state.newItem.description} 
            onChange={createUpdateField('description')}
            placeholder="content">
          </textarea>
        </div>
        <div className="field">
          <label>tags</label>
          <input 
            placeholder="tags"
            value={props.state.newItem.tags}
            onChange={createUpdateField('tags')}
            type="text">
          </input>
        </div>
        <button type="submit" className="savebutton ui right floated primary button">
          save
        </button>
        <button className="ui right floated button">
          cancel
        </button>
      </form>
    </div>
  );
};
