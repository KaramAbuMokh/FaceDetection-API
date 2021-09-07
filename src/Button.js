import React from 'react'

class Button extends React.Component{
    constructor(props){
        super(props)

    }

    render(){
        return (
            <a
              onClick={()=>this.props.func()}
              href="#0"
              className="f3 mh5 mv1 pa2 w4 ba link dim black db"
            >
              {this.props.text}
            </a>
        )
    }
}

export default Button