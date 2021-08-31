import React from "react";
import Logo from "./Logo";

class NavBar extends React.Component {
  
  constructor(props) {
    super(props);

    this.setState({
      authorized:false
    })
  }

  render() {

    return (
      <div className="flex justify-between">
        <Logo />
        {this.props.page==='home' || this.props.page==='ByLink' || this.props.page==='ByLocalFile' ? (
          <div className="ma3 flex justify-between">
            
            <a
              onClick={() => this.props.changePage("ByLink")}
              href="#0"
              className="f3 ma2 pa2 w4 ba link dim black db"
            >
              By Link
            </a>
            <a
              onClick={() => this.props.changePage("ByLocalFile")}
              href="#0"
              className="f3 ma2 pa2 w4 ba link dim black db"
            >
              By Local File
            </a>
            <a
              onClick={() => this.props.changePage("signin")}
              href="#0"
              className="f3 ma2 pa2 w4 ba link dim black db"
            >
              Logout
            </a>
          </div>
        ) : (
          <div className="ma3 ">
            <a
              onClick={() => this.props.changePage("signin")}
              href="#0"
              className="f3 ma2 pa2 w4 ba link dim black db"
            >
              Signin
            </a>
            <a
              onClick={() => this.props.changePage("register")}
              href="#0"
              className="f3 ma2 pa2 w4 ba link dim black db"
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
