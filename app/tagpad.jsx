var React = require('react');
var ReactDOM = require('react-dom');
var Application = require('./components/Application.jsx');
var model = require('./actions/model.js');
var navigation = require('./actions/navigation.js');

require('./tagpad.css');


console.log('hello');
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

// Handle browser navigation events
window.addEventListener('hashchange', navigation.navigated, false);

navigation.navigated(); // set the page based on the start route.

// set initial state.
model.setState(require('./initialState.js'));

fetch('/items.json').then(function (response) {
  return response.json()
}).then(function (json) {
  console.log('parsed json', json);
  model.setState({items: json});
}).catch(function (ex) {
  console.log('parsing failed', ex);
})

