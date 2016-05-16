var React = require('react');
require('./add.css');

module.exports = function Add(props) {
  
  function createUpdateField(fieldName) {
    return function (e) {
      var changes = {};
      e.preventDefault();
      changes[fieldName] = e.target.value;
      var updated = Object.assign({}, props.newItem, changes);
      props.updateNewItem(updated);
    };
  }
  return (
    <div className="ui main text container">
      <form className="ui form" onSubmit={props.submitNewItem} >
        <div className="field">
          <label>title</label>
          <input 
            placeholder="title" 
            value={props.newItem.title}
            onChange={createUpdateField('title')}
            type="text">
          </input>
        </div>
        <div className="field">
          <label>content</label>
          <textarea 
            value={props.newItem.description} 
            onChange={createUpdateField('description')}
            placeholder="content">
          </textarea>
        </div>
        <div className="field">
          <label>tags</label>
          <input 
            placeholder="tags"
            value={props.newItem.tags}
            onChange={createUpdateField('tags')}
            type="text">
          </input>
        </div>
        <button type="submit" className="savebutton ui right floated primary button">
          save
        </button>
        <button 
          className="ui right floated button"
          onClick={props.cancel}
          >
          cancel
        </button>
      </form>
    </div>
  );
};
