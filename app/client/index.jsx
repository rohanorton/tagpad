var React = require('react');
var ReactDOM = require('react-dom');
var Tagpad = require('./components/tagpad/Tagpad.jsx');

var Router = require('react-router').Router
var Route = require('react-router').Route
var hashHistory = require('react-router').hashHistory;

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Tagpad} />
    <Route path="browse" component={Tagpad} />
    <Route path="add" component={Tagpad} />
  </Router>,
  document.getElementById('react-container')
);
