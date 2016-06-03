import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import App from './components/App';
import navigation from './helpers/navigation'
import model from './helpers/model'

require('./tagpad.css');

function render() {
  ReactDOM.render(
    React.createElement(App, model.getState()),
    document.getElementById('react-container')
  );
}

model.onStateChange(render);

// Handle browser navigation events
window.addEventListener('hashchange', navigation.navigated, false);

navigation.navigated();
