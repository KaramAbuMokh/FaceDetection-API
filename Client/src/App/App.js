import React from "react";
import NavBar from "../containers/navbar/NavBar";
import Form from "../containers/form/Form";
import LoginRegister from "../containers/signinRegister/LoginRegister";
import Particles from "react-tsparticles";
import "./App.css";
import part from './part'


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

    console.log('setUser in app class',user.history)
    
  }

  render() {
    return (
      <div className="App">
        <Particles
          className="particles "
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={part}
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
              {/* {
                this.state.page === 'ByLocalFile' ? <Form page={this.state.page} history={this.state.history} link={this.state.link} user={this.state.user} setUser={this.setUser}/> : (
                  this.state.page ==='ByLink' ? <FormByLink history={this.state.history} link={this.state.link} user={this.state.user} setUser={this.setUser}/> : null
                )
              } */}
              <Form changePage={this.changePage} page={this.state.page} history={this.state.history} link={this.state.link} user={this.state.user} setUser={this.setUser}/>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
