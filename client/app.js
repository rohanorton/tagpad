import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import App from './components/App';
import navigation from './helpers/navigation'
import model from './helpers/model'

require('./tagpad.css');

// User same origin to send cookies through network layer
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
);

function render() {
  let state = model.getState();
  if (!state.transitioning) {
    ReactDOM.render(
      React.createElement(App, state),
      document.getElementById('react-container')
    );
  }
}

model.onStateChange(render);

// Handle browser navigation events
window.addEventListener('hashchange', navigation.navigated, false);

navigation.navigated();
