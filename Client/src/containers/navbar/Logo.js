import React from "react";
import Tilt from "react-tilt";
import brain from "./brain.png";

class Logo extends React.Component {
  render() {
    return (
      <Tilt
        className="Tilt  shadow-1 ma3 pa3"
        options={{ max: 25 }}
        style={{ height: 90, width: 90 }}
      >
        <img className=" Tilt-inner " src={brain} alt="Paris" />
      </Tilt>
    );
  }
}

export default Logo;
