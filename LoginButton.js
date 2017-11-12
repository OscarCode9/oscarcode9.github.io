import React, { Component } from 'react';

class LoginButton extends Component {
  render() {
    return (
      <button onClick={this.props.onClick}>
        Login
      </button>
    )

  }
}

class LogoutButton extends Component {
  render() {
    return (
      <button onClick={this.props.onClick}>
        Logout
      </button>
    )
  }
}

class LoginControl extends Component {
  constructor(props){
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {
      isLoggedIn : false
    };
  }
  handleLoginClick(){
    this.setState({
      isLoggedIn: true
    });
  }
  handleLogoutClick(){
    this.setState({
      isLoggedIn: false
    });
  }
  render(){
    let button = null; 
    console.log(this.state.isLoggedIn);
    console.log("quE ONDA WE");
    if(this.state.isLoggedIn){
      button = <LogoutButton onClick= {this.handleLogoutClick}/>;
    }else{
        button = <LoginButton onClick = {this.handleLoginClick}/>;
      }
      return(
        <div>
          {button}
        </div>
      )
    }
          
  }

  export default LoginControl;


