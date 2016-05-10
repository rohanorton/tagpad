var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router
var Route = require('react-router').Route
var hashHistory = require('react-router').hashHistory;
var IndexRoute = require('react-router').IndexRoute;

var Menu = require('./components/menu/Menu.jsx');
var Add = require('./components/add/Add.jsx');
var Browse = require('./components/browse/Browse.jsx');

require('./tagpad.css');

function App (props) {
  return (
    <div>
      <Menu page={props.location.pathname.replace("/", "")} />
      {props.children}
    </div>
  );
};

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Browse} />
      <Route path="browse" component={Browse} />
      <Route path="add" component={Add} />
    </Route>
  </Router>,
  document.getElementById('react-container')
);
