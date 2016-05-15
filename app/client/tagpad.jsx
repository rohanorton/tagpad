var React = require('react');
var ReactDOM = require('react-dom');
var Application = require('./components/Application.jsx');
var model = require('./actions/model.js');
var navigation = require('./actions/navigation.js');

require('./tagpad.css');

function render() {
  var state = model.getState();
  if (!state.transitioning) {
    ReactDOM.render(
      React.createElement(Application, state),
      document.getElementById('react-container')
    );
  }
}

model.onStateChange(render);
// set initial state.
model.setState(require('./initialState.js'));

// Handle browser navigation events
window.addEventListener('hashchange', navigation.navigated, false);
