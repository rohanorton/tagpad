import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import App from './components/App';

require('./tagpad.css');

// TODO handle routing

function searchChange (newSearchValue) {
  ReactDOM.render(
    <App searchChange={searchChange} search={newSearchValue} />,
    document.getElementById('react-container')
  );
}

searchChange('');

