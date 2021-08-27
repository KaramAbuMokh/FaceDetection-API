import React from "react";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return this.props.page === "home" ? (
      <div className="ma3 flex justify-end">
        <a
          onClick={() => this.props.changePage("signin")}
          href="#0"
          className="f3 ma2 pa2 w4 ba link dim black db"
        >
          Logout
        </a>
      </div>
    ) : (
      <div className="ma3 flex justify-end">
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
    );
  }
}

export default NavBar;
