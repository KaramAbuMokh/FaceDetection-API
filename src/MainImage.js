import React from 'react'

class MainImage extends React.Component{
    constructor(props){
        super(props)
    }


    render(){
        return(
            <div className="relative mh0 h-100 w-100" >
                {
                    <img className='w-100 h-100'  id="myimg" src={this.props.data}/>
                }
                <div>
                    {this.props.renderedOutput }
                </div>
            </div>
        )
    }
}

export default MainImage;