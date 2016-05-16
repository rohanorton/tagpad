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

  function getFieldClass(fieldName) {
    var areErrors = props.newItem.errors && props.newItem.errors[fieldName];
    return 'field ' + (areErrors ? 'error': '');
  }

  function getErrorLabel(fieldName){
    var msg = props.newItem.errors && props.newItem.errors[fieldName];
    if (msg) {
      return (
        <div className="ui pointing red basic label">
          {msg}
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="ui main text container">

      <form className="ui form" onSubmit={props.submitNewItem} >
        <div className={getFieldClass('title')} >
          <label>title</label>
          <input 
            value={props.newItem.title}
            onChange={createUpdateField('title')}
            type="text">
          </input>
          {getErrorLabel('title')}
        </div>
        <div className={getFieldClass('description')}>
          <label>content</label>
          <textarea 
            value={props.newItem.description} 
            onChange={createUpdateField('description')}
            >
          </textarea>
          {getErrorLabel('description')}
        </div>
        <div className={getFieldClass('tags')}>
          <label>tags</label>
          <input 
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
