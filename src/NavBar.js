import React from "react";
import Logo from "./Logo";
import './navbar.css'

class NavBar extends React.Component {
  
  constructor(props) {
    super(props);

    this.state={
      authorized:false
    }
  }

  render() {

    return (
      <div className="flex justify-between navbar">
        <Logo />
        {this.props.page==='home' || this.props.page==='ByLink' || this.props.page==='ByLocalFile' ? (
          <div className="navbar-content ma3 flex justify-center">
            <a
              onClick={() => this.props.changePage("home")}
              href="#0"
              className="f3 ma2 pv2 link dim  db logout"
            >
              Home
            </a>
            <a
              onClick={() => this.props.changePage("ByLink")}
              href="#0"
              className="f3 ma2 pv2 link dim black db"
            >
              Via Link
            </a>
            <a
              onClick={() => this.props.changePage("ByLocalFile")}
              href="#0"
              className=" f3 ma2 pv2 link dim black db"
            >
              Via File
            </a>
            <a
              onClick={() => this.props.changePage("signin")}
              href="#0"
              className="f3 ma2 pv2 link dim  db logout"
            >
              Logout
            </a>
            
          </div>
        ) : (
          <div className="navbar-content  ma3 flex justify-center">
            <a
              onClick={() => this.props.changePage("signin")}
              href="#0"
              className="f3 ma2 pv2 link dim black db"
            >
              Signin
            </a>
            <a
              onClick={() => this.props.changePage("register")}
              href="#0"
              className="f3 ma2 pv2 link dim black db"
            >
              register
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default NavBar;
