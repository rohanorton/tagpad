import React from 'react';

require('./notification.css');

let Notifications = {
  loading: function (props) {
    return (
      <div className="ui compact yellow message">
        <p>{props.message}</p>
      </div>
    );
  },
  success: function (props) {
    return (
      <div className="ui compact green message">
        <p>{props.message}</p>
      </div>
    );
  },
  error: function (props) {
    return (
      <div className="ui compact negative message">
        <i className="close icon" onClick={props.close}></i>
        <div className="header">
          {props.header}
        </div>
        <p>
          {props.message}
        </p>
      </div>
    );
  }
};

export default function (props) {
  let style = {height: '7.5em'};
  if (!props.type) {
    style.visibility = 'hidden';
  }
  if (props.type === 'error') {
    style.height = '8.94em';
  }
  return (
    <div style={style} id="notification-container" className="ui center aligned container">
      {props.type && Notifications[props.type](props)}
    </div>
  );
}
