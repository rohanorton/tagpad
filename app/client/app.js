import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import App from './components/App';
import navigation from './helpers/navigation'

require('./tagpad.css');

function render() {
  ReactDOM.render(
    React.createElement(App, {
      location: navigation.getLocation(),
      query: navigation.getQuery()
    }),
    document.getElementById('react-container')
  );
}

// Handle browser navigation events
window.addEventListener('hashchange', render, false);

render();
