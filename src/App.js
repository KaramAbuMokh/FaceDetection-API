import React from "react";
import Logo from "./Logo";
import NavBar from "./NavBar";
import Form from "./Form";
import LoginRegister from "./LoginRegister";
import Particles from "react-tsparticles";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      page: "signin",
    };
    this.changePage = this.changePage.bind(this);
  }

  changePage(pageName) {
    this.setState({ page: pageName });
  }

  render() {
    return (
      <div className="App">
        <Particles
          className="particles "
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={{
            background: {
              color: {
                value: "#A52A2A",
              },
            },
            fpsLimit: 150,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                bubble: {
                  distance: 400,
                  duration: 0.5,
                  opacity: 0.8,
                  size: 40,
                },
                push: {
                  quantity: 1,
                },
                repulse: {
                  distance: 50,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#aaa000",
              },
              links: {
                color: "#0afaff",
                distance: 80,
                enable: true,
                opacity: 0.5,
                width: 5,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 5,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        />
        <NavBar page={this.state.page} />
        {this.state.page === "signin" || this.state.page === "register" ? (
          <div>
            <LoginRegister
              style={{ position: "absolute" }}
              page={this.state.page}
              changePage={this.changePage}
            />
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
