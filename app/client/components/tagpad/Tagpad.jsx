var React = require('react');
var Menu = require('./menu/Menu.jsx');
var Add = require('./add/Add.jsx');
var Browse = require('./browse/Browse.jsx');

require('./tagpad.css');

module.exports = function (props) {
  var views = {
    'add': <Add />,
    'browse': <Browse />
  };
  return (
    <div>
      <Menu page={props.page}/>
      {views[props.page]}
    </div>
  );
};

