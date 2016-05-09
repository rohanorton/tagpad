var React = require('react');
var Menu = require('./menu/Menu.jsx');
var Add = require('./add/Add.jsx');
var Browse = require('./browse/Browse.jsx');

require('./tagpad.css');

module.exports = function (props) {
  var page = props.location.pathname.replace("/", "");
  if (!page.length) {
    page = 'browse'; // default page at /
  }
  var views = {
    'add': <Add />,
    'browse': <Browse />
  };
  return (
    <div>
      <Menu page={page}/>
      {views[page]}
    </div>
  );
};

