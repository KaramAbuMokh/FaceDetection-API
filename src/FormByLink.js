import React from "react";
import Clarifai from "clarifai";
import HistoryImages from './HistoryImages'



class FormByLink extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = { 
      imageLink: '', 
      faceBox: [] , 
      boundingBoxes:[] , 
      showBoxes:false,
      renderedOutput:null, 
      score:this.props.user.score,
      history:this.props.user.history
    };
    this.linkChange = this.linkChange.bind(this);    
    this.predict = this.predict.bind(this);
    this.changePath = this.changePath.bind(this);
    
  }

  linkChange(event) {
    this.setState({
      imageLink: "",
      faceBox:[],
      boundingBoxes:[],
      showBoxes:false,
      renderedOutput:null
    })
    this.setState({imageLink:event.target.value})
    event.target.value === '' ? this.setState({showBoxes : false,boundingBoxes:[],faceBox:[]}) : this.setState({showBoxes : true})
  }

  boundface = (boundingBox) => {
    
    this.setState({ 
      boundingBoxes: this.state.boundingBoxes.concat([boundingBox])
    })

    const image = document.getElementById("myimg");
    
    const bounds = {
      leftCol: Number(boundingBox.left_col)  ,
      topRow: Number(boundingBox.top_row),
      bottomRow: Number(boundingBox.bottom_row) ,
      rightCol: Number(boundingBox.right_col) ,
    };

    this.setState({
      faceBox: this.state.faceBox.concat([bounds])
    })
    
  };


  addToScore(){

    console.log('ccccccc',this.props.user.id)

    fetch('http://localhost:8000/image',{
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body:JSON.stringify({
        id: this.props.user.id,
        image: {
          type:'link',
          data: this.state.imageLink
        }
        
      })
    })
    .then(response => response.json())
    .then( data => {

      let user=this.props.user
      user.history=data.history
      user.score=data.score
      this.props.setUser(user)
      
      this.setState({score:data.score, history:data.history})

    })
  }



  predict() {

    console.log('bbbbbbbb',this.state.imageLink)

    const raw = JSON.stringify({
      user_app_id: {
        user_id: "uosuofuwu6u4",
        app_id: "facedetection-api",
      },
      inputs: [
        {
          data: {
            image: {
                url: `${this.state.imageLink}`,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key 4c390cc6f8f34410a26abff203033808",
      },
      body: raw,
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch(
      `https://api.clarifai.com/v2/models/${Clarifai.FACE_DETECT_MODEL}/outputs`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) =>{
        let regs=JSON.parse(result).outputs[0].data.regions
        

        regs.forEach(box => {
          if(box.value>0.9){
            this.boundface(box.region_info.bounding_box)
          }
        });

        let found=false

        this.state.history.forEach(item =>{
          if(item.type==='link' && this.state.imageLink===item.data){
            found=true
          }
        }) 

        if(!found){
          this.addToScore()
        }
        
      })
      .catch((error) => console.log("error", error));
  }

  static getDerivedStateFromProps(props, state){
    const {faceBox} = state
    let boxesDivs = faceBox.map((item,i) => <div key={i} className='bounding-box' style={{top: (item.topRow*100)+'%', bottom: (100-item.bottomRow*100)+'%' , left: (item.leftCol*100)+'%', right: (100-item.rightCol*100)+'%' }}></div> )
    return {renderedOutput : boxesDivs}
  }

  refresh=()=>{
    let a=document.querySelector('input');
    a.value=''
    this.setState({
      imageLink: "",
      faceBox:[],
      boundingBoxes:[],
      renderedOutput:null
    })
  }

  changePath=(link,type)=>{
    this.refresh()
    this.setState({
      imageLink:link,
       showBoxes:true
      })
  }

  render() {
    console.log(this.state)
    return (
      <div key={this.props.link} className="flex flex-column items-center">
        <div>
          <h1>{this.state.score}</h1>
        </div>
        <div>
          <a
            onClick={this.refresh}
            href="#0"
            className="f3 ma2 pa2 w4 ba link dim black db"
            >
            refresh
          </a>
        </div>
          <div  className=" w-25 pa2 ">
            <input id='input' type='text' name='url' onChange={this.linkChange}/>
            <button onClick={this.predict}>Predict</button>
          </div>


          <div className=" ma0  w-50 ">
            <div  className="relative mh0  w-100">
              <img  id="myimg" src={this.state.imageLink}  />
              <div>
                {this.state.showBoxes ? this.state.renderedOutput : <div></div>}
              </div>
            </div>
          </div>

          {/* setLink={this.setLink} history={this.state.history} */}
          <HistoryImages  setLink={this.changePath} history={this.props.history}/>

          
      </div>
    );
  }
}

export default FormByLink;
