import React from 'react';
import navigation from '../../helpers/navigation'

require('./menu.css');


function logout (e) {
  e.preventDefault();
  fetch('logout', {
    method: 'POST',
    credentials: 'same-origin'
  }).then(function(res) {
    return res.text();
  }).then(function(text) {
    if (text === 'Success') {
      navigation.startNavigating('login');
    }
  });
}

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

        <a href="#/logout" onClick={logout} className="item right">logout</a>
      </div>
      
      
    </div>
  );
};
module.exports.propTypes = {
  page: React.PropTypes.string.isRequired
};
