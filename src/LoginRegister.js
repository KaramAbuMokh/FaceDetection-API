import React from "react";
import Signin from "./Signin";
import Register from "./Register";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("this.props.page", this.props.page);
    return (
      <div>
        {this.props.page === "signin" ? (
          <div>
            <Signin changePage={this.props.changePage} />
          </div>
        ) : (
          <div>
            <Register changePage={this.props.changePage} />
          </div>
        )}
      </div>
    );
  }
}

export default LoginRegister;
