import React from "react";
import Signin from "./Signin";
import Register from "./Register";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.page === "signin" ? (
          <div>
            <Signin setUser={this.props.setUser} changePage={this.props.changePage} />
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
