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

model.setState({
  location: require("./actions/navigation.js").getLocation(),
  items: [],
  itemForms: {},
  newItem: require('./actions/helpers.js').getNewItem()
});



// Handle browser navigation events
window.addEventListener('hashchange', navigation.navigated, false);

navigation.navigated(); // set the page based on the start route.

fetch('/items').then(function (response) {
  return response.json()
}).then(function (json) {
  model.setState({items: json});
}).catch(function (ex) {
  console.log('parsing failed', ex);
})

