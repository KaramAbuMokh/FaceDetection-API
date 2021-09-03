import React from "react";
import NavBar from "./NavBar";
import Form from "./Form";
import FormByLink from './FormByLink'
import LoginRegister from "./LoginRegister";
import Particles from "react-tsparticles";
import "./App.css";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      page: "signin",
      user:"",
      history:null,
    };
    
    this.changePage = this.changePage.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  changePage(pageName) {
    this.setState({ page: pageName });
  }

  setUser=(user)=>{
    this.setState({
      user:user,
      history:user.history
    })
    
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
                value: "#ffffff",
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
                value: "#0000a0",
              },
              links: {
                color: "#0000ff",
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
        <div className="flex flex-column">
          <NavBar changePage={this.changePage} page={this.state.page} />
          {this.state.page === "signin" || this.state.page === "register" ? (
            <div  className='ma6'>
              <LoginRegister
                setUser={this.setUser}
                style={{ position: "absolute" }}
                page={this.state.page}
                changePage={this.changePage}
              />
            </div>
          ) : (
            <div className='ma6'>
              {
                this.state.page === 'ByLocalFile' ? <Form history={this.state.history} link={this.state.link} user={this.state.user} setUser={this.setUser}/> : (
                  this.state.page ==='ByLink' ? <FormByLink history={this.state.history} link={this.state.link} user={this.state.user} setUser={this.setUser}/> : null
                )
              }
              
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
