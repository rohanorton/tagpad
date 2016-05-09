var React = require('react');
var Link = require('react-router').Link
require('./menu.css');
module.exports = function (props) {
  return (
    <div className="ui fixed inverted menu">
      <div className="ui container">


        <Link to="/browse" className="header item">
          <img className="logo" src={require("./img/logo.png")} ></img>
          tagpad
        </Link>
        <Link to="/browse" className={"item " + (props.page === 'browse' ? 'active' : '')}>browse</Link>
        <Link to="/add" className={"item " + (props.page === 'add' ? 'active' : '')}>add</Link>
      </div>
    </div>
  );
};
