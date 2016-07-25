import React from 'react';
import navigation from '../../helpers/navigation'
import 'whatwg-fetch';

require('./style.css')


module.exports = React.createClass({
  validate: function (credentials) {
    credentials.errors = {};
    if (!credentials.email) {
      credentials.errors.email = ['Please enter your email address'];
    } 
    if (!credentials.password) {
      credentials.errors.password = ['Please enter your password'];
    } 
  },
  showServerError: function (message) {
    var state = this.state ? {email: this.state.email, password: this.state.password} : {};
    state.errors = {};
    if (message.indexOf('email') !== -1) {
      state.errors.email = [ message ];
    } else if (message.indexOf('password') !== -1) {
      state.errors.password = [ message ];
    }
    state.loading = false;
    this.setState(state);
  },
  login: function () {
    let showServerError = this.showServerError;
    this.setState({loading: true, errors: {}});
    fetch('login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(this.state)
    }).then(function(res) {
      return res.json();
    }).then(function(json) {
      if (json.status === 'success') {
        navigation.startNavigating('browse');
      } else {
        // this is the failiure case
        if (json.message) {
          showServerError(json.message);
        }
      }
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var credentials = this.state ? {email: this.state.email, password: this.state.password}: {};
    this.validate(credentials);
    if (Object.keys(credentials.errors).length !== 0) {
      // show the errors;
      this.setState(credentials);
    } else {
      this.login();
    }
  },
  updatePassword: function (e) {
    var newState = Object.assign({}, this.state, {password: e.target.value});
    this.setState(newState);
  },
  updateEmail: function (e) {
    var newState = Object.assign({}, this.state, {email: e.target.value});
    this.setState(newState);
  },
  getFieldErrorClass: function (fieldName) {
    var areErrors = !!this.getErrorMessage(fieldName);
    return (areErrors ? 'error': '');
  },
  getErrorMessage: function (fieldName) {
    return this.state && this.state.errors && this.state.errors[fieldName];
  },
  getErrorLabel: function (fieldName){
    var msg = this.getErrorMessage(fieldName);
    if (msg) {
      return (
        <div className="ui  pointing red basic label">
          {msg}
        </div>
      );
    } else {
      return null;
    }
  },

  render: function () {
    return (
      <div className="login-form ui middle aligned center aligned grid">
        <div className="column">
          <h2 className="ui header image header">
            <div className="content">
              Log-in to your account
            </div>
          </h2>
          <form 
            id="login-form"
            onSubmit={this.handleSubmit}
            className="ui large form">
            <div className="ui">
              <div className={"field required " + this.getFieldErrorClass('email')}>
                <div className="ui left icon input">
                  <i className="user icon"></i>
                  <input 

                    disabled={!!(this.state && this.state.loading)} 
                    type="text" 
                    name="email" 
                    placeholder="E-mail address" 
                    onChange={this.updateEmail}
                  />
                </div>

              {this.getErrorLabel('email')}
              </div>
              <div className={"field required " + this.getFieldErrorClass('password')}>
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input 
                    disabled={!!(this.state && this.state.loading)} 
                    type="password" 
                    onChange={this.updatePassword} 
                    name="password" 
                    placeholder="Password" 
                  />
                </div>

              {this.getErrorLabel('password')}
              </div>
              <button 
                type="submit" 
                className={"ui fluid large orange submit " + (this.state && this.state.loading ? 'loading' : '') + " button"}>
                Login
              </button>
            </div>
            <div className="ui error message"></div>
          </form>
          {/*<div className="ui signup-container">
            New to us? <a href="#">Sign Up</a>
          </div>*/}
        </div>
      </div>
    );   
  }
});
