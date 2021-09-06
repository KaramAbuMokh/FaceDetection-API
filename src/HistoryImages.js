import React from 'react'
import './design.css'

class HistoryImages extends React.Component{
    constructor(props){
        super(props)
        this.state={
            history:props.history,
            renderedOutput:null,
            page:props.page
        }
    }


    static getDerivedStateFromProps(props, state){
        
        let page=props.page
        
        return {page}
      }

    render(){
        let images = this.props.history.map((item,i) =><div key={i}  className='wlad'><img onClick={this.props.page==='home'?null:()=>this.props.setData(item.data,item.type,item.faceBox)} key={`${i}`} src={item.data} /></div>  )

        return (
            <div key={this.props.history} className='grid3cols'>
                {images}
            </div>
        )
    }
}


export default HistoryImages;