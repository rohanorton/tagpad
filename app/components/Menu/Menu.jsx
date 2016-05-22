var React = require('react');

require('./menu.css');
module.exports = function (props) {
  return (
    <div className="ui fixed inverted menu">
      <div className="ui container">
        <a href="#/browse" className="header item">
          <img className="logo" src={require("./img/logo.png")} ></img>
          tagpad
        </a>
        <a href="#/browse" className={"item " + (props.page === 'browse' ? 'active' : '')}>browse</a>
        <a href="#/add" className={"item " + (props.page === 'add' ? 'active' : '')}>add</a>
      </div>
    </div>
  );
};
module.exports.propTypes = {
  page: React.PropTypes.string.isRequired
};
