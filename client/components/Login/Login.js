var React = require('react');

require('./style.css')

module.exports = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    fetch('login', {
      method: 'post',
      body: new FormData(document.getElementById('login-form'))
    }).then(function(res) {
      alert('response = ' + JSON.stringify(res));
    });
  },
  updatePassword: function (e) {
    var newState = Object.assign({}, this.state, {password: e.target.value});
    this.setState(newState);
  },
  updateEmail: function (e) {
    var newState = Object.assign({}, this.state, {email: e.target.value});
    this.setState(newState);
  },
  render: function () {
    return (
      <form 
        onSubmit={this.handleSubmit}
        id="login-form"
        className="login-form ui middle aligned center aligned grid">
        <div className="column">
          <h2 className="ui header image header">
            <div className="content">
              Log-in to your account
            </div>
          </h2>
          <form className="ui large form">
            <div className="ui">
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon"></i>
                  <input 
                  type="text" 
                  name="email" 
                  onChange={this.updateEmail} 
                  placeholder="E-mail address" />
                </div>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input 
                    type="password" 
                    onChange={this.updatePassword} 
                    name="password" placeholder="Password" />

                </div>
              </div>
              <button 
                type="submit" 
                className="ui fluid large orange submit button">
                Login
              </button>
            </div>
            <div className="ui error message"></div>
          </form>
          <div className="ui signup-container">
            New to us? <a href="#">Sign Up</a>
          </div>
        </div>
      </form>
    );
  }
});
