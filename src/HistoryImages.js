import React from 'react'
import './design.css'

class HistoryImages extends React.Component{
    constructor(props){
        super(props)
        this.state={
            history:props.history,
            renderedOutput:null
        }
    }

    render(){
        let images = this.props.history.map((item,i) =><div key={i}  className='wlad'><img onClick={()=>this.props.setLink(item.data,item.type)} key={`${i}`} src={item.data} /></div>  )

        return (
            <div key={this.props.history} className='grid3cols'>
                {images}
            </div>
        )
    }
}


export default HistoryImages;