import React from 'react'
import './design.css'

class Input extends React.Component{
    constructor(props){
        super(props)

    }

    render(){
        console.log(this.props)

        return  <div key={this.props.type}>
            {this.props.type==='text'? 
            (
                <input 
                    id='text' 
                    placeholder='Insert Link'
                    className='f3 mh5 mv1 pa2 w4 ba link dim black db'  
                    key={this.props.type} 
                    type='text' 
                    name='text' 
                    onChange={this.props.onChange}
                />
            ):(
                <div>
                    <input
                        id='file' 
                        className='mv1 inputfile' 
                        key={this.props.type} 
                        type='file' name='file' 
                        onChange={this.props.onChange}
                        hidden='true'
                    />
                    <label htmlFor="file" className='f3 mh5 mv1 pa2 w4 ba link dim black db' >
                        Select File
                        <p class="file-name"></p>
                    </label>
                </div>
            )
        }

        </div>
        
        
        
        
        
        
        
        
        
        

    }
}

export default Input