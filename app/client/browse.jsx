var React = require('react');
var ReactDOM = require('react-dom');
var Tagpad = require('./components/tagpad/Tagpad.jsx');

ReactDOM.render(
  <Tagpad page="browse" />,
  document.getElementById('react-container')
);
