import React from 'react'
import './design.css'

class HistoryImages extends React.Component{
    constructor(props){
        super(props)
    }



    render(){

        console.log('history image',this.props)
        let images = this.props.history.map((item,i) =><div key={i}  className='wlad'><img onClick={()=>this.props.setData(item.data,item.type,item.faceBox)} key={`${i}`} src={item.type==='file' ? 'data:image/jpeg;base64,'+item.data:item.data} /></div>  )

        return (
            <div key={this.props.link} className='grid3cols'>
                {images}
            </div>
        )
    }
}


export default HistoryImages;