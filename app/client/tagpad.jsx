var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router
var Route = require('react-router').Route
var hashHistory = require('react-router').hashHistory;
var IndexRoute = require('react-router').IndexRoute;

var Menu = require('./components/menu/Menu.jsx');
var Add = require('./components/add/Add.jsx');
var Browse = require('./components/browse/Browse.jsx');

// handling state
var model = require('./store/model.js');

require('./tagpad.css');

function App (props) {
  return (
    <div>
      <Menu page={props.location.pathname.replace("/", "")} />
      {props.children}
    </div>
  );
};

// Creating custom fn to pass down state as props to every component.
// from: https://github.com/reactjs/react-router/issues/1857#issuecomment-203247908
function render () {
  var state = model.getState();
  console.log('new state = ', state);
  var createElement = function (Component, props) {
    return <Component state={state} {...props} />
  };

  ReactDOM.render(
    <Router history={hashHistory} createElement={createElement}>
      <Route path="/" component={App}>
        <IndexRoute component={Browse} />
        <Route path="browse" component={Browse} />
        <Route path="add" component={Add} />
      </Route>
    </Router>,
    document.getElementById('react-container')
  );
}

model.onStateChange(render);
// set initial state.
model.setState(require('./store/initialState.js').state);
