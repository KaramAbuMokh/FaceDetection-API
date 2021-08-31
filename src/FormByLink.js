import React from "react";
import Clarifai from "clarifai";



class FormByLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      imageLink: "", 
      faceBox: [] , 
      boundingBoxes:[] , 
      width: 0, 
      height:0, 
      showBoxes:false,
      renderedOutput:null, 
      file:null,
      base64URL: ""
    };
    this.linkChange = this.linkChange.bind(this);    
    this.predict = this.predict.bind(this);
  }

  linkChange(event) {
    this.setState({
      imageLink: "",
      file:null,
      faceBox:[],
      boundingBoxes:[],
      base64URL:"",
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
    const width = Number(image.width);
    const height = Number(image.height);
    this.setState({ 
      width,height
    })
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



  predict() {

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
        console.log(JSON.parse(result).outputs[0]);
        let regs=JSON.parse(result).outputs[0].data.regions

        regs.forEach(box => {
          if(box.value>0.9){
            this.boundface(box.region_info.bounding_box)
          }
        });
      })
      .catch((error) => console.log("error", error));
  }

  static getDerivedStateFromProps(props, state){
    const {faceBox} = state
    let boxesDivs = faceBox.map((item,i) => <div key={i} className='bounding-box' style={{top: (faceBox[i].topRow*100)+'%', bottom: (100-faceBox[i].bottomRow*100)+'%' , left: (faceBox[i].leftCol*100)+'%', right: (100-faceBox[i].rightCol*100)+'%' }}></div> )
    return {renderedOutput:boxesDivs}
  }

  refresh=()=>{
    let a=document.querySelector('input');
    a.value=''
    this.setState({
      imageLink: "",
      file:null,
      faceBox:[],
      boundingBoxes:[],
      base64URL:"",
      showBoxes:false,
      renderedOutput:null
    })
  }
  
  render() {
    return (
      <div className="flex flex-column items-center">
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


          <div className=" ma0  w-50">
            <div  className="absolute ma3  w-50">
              <img  id="myimg" src={this.state.imageLink}  />
              <div>
                {this.state.showBoxes ? this.state.renderedOutput : <div></div>}
              </div>
            </div>
          </div>

          
      </div>
    );
  }
}

export default FormByLink;
