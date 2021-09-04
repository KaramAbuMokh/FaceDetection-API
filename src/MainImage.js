import React from 'react'

class MainImage extends React.Component{
    constructor(props){
        super(props)
        this.state={
            renderedOutput:null,
            show:this.props.show,
            showBoxes:this.props.showBoxes,
            type:this.props.type,
            link:this.props.link,
            baseURL64:this.props.baseURL64,
            imageStatus:this.props.imageStatus
        }
    }


    static getDerivedStateFromProps(props, state){
        const {faceBox} = props
        let boxesDivs = faceBox.map((item,i) => <div key={i} className='bounding-box' style={{top: (faceBox[i].topRow*100)+'%', bottom: (100-faceBox[i].bottomRow*100)+'%' , left: (faceBox[i].leftCol*100)+'%', right: (100-faceBox[i].rightCol*100)+'%' }}></div> )
        
        let show=props.show
        let showBoxes=props.showBoxes
        let type=props.type
        let link=props.link
        let baseURL64=props.baseURL64
        let imageStatus=props.imageStatus
        
        return {renderedOutput:boxesDivs,show,showBoxes,type,link,baseURL64,imageStatus}
      }

    render(){
        return(
            <div className="relative mh0 h-100 w-100" key={this.props.imageStatus}>
                {
                    this.state.show ? (<img className='w-100 h-100'  id="myimg" src={this.state.type==='text' ? (this.state.link) : (this.state.baseURL64)}/>) : null  
                }
                <div>
                    {this.state.showBoxes ? this.state.renderedOutput : <div></div>}
                </div>
            </div>
        )
    }
}

export default MainImage;