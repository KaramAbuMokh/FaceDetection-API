import logo from "./logo.svg";
import React from "react";

class App extends React.Component {
  constructor() {
    super();
    this.state({ page: "signin" });
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.state.page === "signin" ? (
          <div>
            <LoginRegister />
          </div>
        ) : (
          <div>
            <Logo />
            <Form />
          </div>
        )}
      </div>
    );
  }
}

export default App;
