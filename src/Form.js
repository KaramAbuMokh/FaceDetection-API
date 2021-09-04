import React from "react";
import Clarifai from "clarifai";
import HistoryImages from './HistoryImages'
import MainImage from "./MainImage";
import Button from './Button'
import Input from './Input'



class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      imageStatus:props.page==='home' ? null : (props.page==='ByLink' ? 'text' : 'file'),
      page: props.page,
      type: props.page==='home' ? null : (props.page==='ByLink' ? 'text' : 'file'),
      faceBox:[],
      show:false,
      link:null,
      base64URL:null,
      showBoxes:false,
      inputType:props.page==='home' ? null : (props.page==='ByLink' ? 'text' : 'file'),
      imageType:null,
      boundingBoxes:[],
      width: 0, 
      height:0, 
      score:this.props.user.score,
      history:this.props.user.history
    };

    this.linkChange = this.linkChange.bind(this);    
    this.predictFile = this.predictFile.bind(this);
    this.predictLink = this.predictLink.bind(this);
    this.refresh = this.refresh.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.linkChange = this.linkChange.bind(this);
  }


  linkChange(event) {
    this.setState({
      link: event.target.value,
      imageStatus:this.state.imageStatus==='file' || this.state.imageStatus==='text' ? true: !this.state.imageStatus,
      faceBox:[],
      boundingBoxes:[],
      showBoxes:false,
      renderedOutput:null,
      show:true,
      imageType:'text',
      file:'',
      show:true,
      base64URL:'',
    })

    event.target.value === '' ? this.setState({
      showBoxes : false,
      show:false,
      boundingBoxes:[],
      faceBox:[]
    }
      ) : this.setState({showBoxes : true})
  }


  fileChange(event) {
    console.log('*******************************')

    this.setState({
      imageStatus:this.state.imageStatus==='file' || this.state.imageStatus==='text' ? true: !this.state.imageStatus,
      showBoxes:false,
      link:'',
      faceBox:[],
      boundingBoxes:[],
      imageType:'file',
      file:'file',
      show:true,
    })

    let { file } = this.state;
    file = event.target.files[0];

    this.getBase64(file)
    .then(result => {
      file["base64"] = result;

      this.setState({
        base64URL:result,
        file
      });
    })
    .catch(err => {
      console.log(err);
    });

    this.setState({
      file:  URL.createObjectURL(event.target.files[0]),
      type:'file'
    });
    
  
    event.target.value === '' ? this.setState({showBoxes : false,boundingBoxes:[],faceBox:[]}) : this.setState({showBoxes : true})
  }

  getBase64 = file => {
    return new Promise(resolve => {
      let baseURL = "";
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  boundface = (boundingBox) => {
    
    this.setState({ 
      boundingBoxes: this.state.boundingBoxes.concat([boundingBox])
    })


    const image = document.getElementById("myimg");
    //image.setAttribute("src",'data:image/jpeg;base64,'+this.state.base64URL)
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


  addToScore(){

    fetch('http://localhost:8000/image',{
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body:JSON.stringify({
        id: this.props.user.id,
        image: {
          type:'file',
          data: this.state.file.base64
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

  predictLink() {

    const raw = JSON.stringify({
      user_app_id: {
        user_id: "uosuofuwu6u4",
        app_id: "facedetection-api",
      },
      inputs: [
        {
          data: {
            image: {
                url: `${this.state.link}`,
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
          if(item.type==='link' && this.state.link===item.data){
            found=true
          }
        }) 

        if(!found){
          this.addToScore()
        }
        
      })
      .catch((error) => console.log("error", error));
  }

  predictFile() {


    const raw = JSON.stringify({
      user_app_id: {
        user_id: "uosuofuwu6u4",
        app_id: "facedetection-api",
      },
      inputs: [
        {
          data: {
            image: {
              base64: `${this.state.base64URL.replace('data:image/jpeg;base64,','')}`,
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
          if(item.type==='file' && this.state.file.base64===item.data){
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
    let boxesDivs = faceBox.map((item,i) => <div key={i} className='bounding-box' style={{top: (faceBox[i].topRow*100)+'%', bottom: (100-faceBox[i].bottomRow*100)+'%' , left: (faceBox[i].leftCol*100)+'%', right: (100-faceBox[i].rightCol*100)+'%' }}></div> )
    return {renderedOutput:boxesDivs}
  }

  refresh=()=>{
    let input=null
    if(this.state.type==='text'){
      input=document.getElementById('text');
      input.value=null
      
    }else{
      input=document.getElementById('file');
      input.files=null
    }

    this.setState({
      file:null,
      faceBox:[],
      boundingBoxes:[],
      base64URL:"",
      renderedOutput:null,
      link:''
    })
  }

  changePath=(link,type)=>{
    let input=null
    if(this.state.inputType==='text'){
      input=document.getElementById('text');
      input.value=null
      
    }else{
      input=document.getElementById('file');
      input.files=null
    }

    this.setState({
      imageStatus:this.state.imageStatus==='file' || this.state.imageStatus==='text' ? true: !this.state.imageStatus,
      base64URL:type==='file' ? link : '', 
      showBoxes:true,
      link:type==='link' ? link : '',
      faceBox:[],
      boundingBoxes:[],
      imageType:type==='link' ? 'text' : 'file',
      file:'',
      show:true,
    })
  }


  static getDerivedStateFromProps(props, state){

    const {faceBox} = state
    let boxesDivs = faceBox.map((item,i) => <div key={i} className='bounding-box' style={{top: (faceBox[i].topRow*100)+'%', bottom: (100-faceBox[i].bottomRow*100)+'%' , left: (faceBox[i].leftCol*100)+'%', right: (100-faceBox[i].rightCol*100)+'%' }}></div> )
    
    // change parameters depends on the page name
    let page=state.page
    let type=state.type
    let inputType=state.inputType

    if(props.page!==page){
      page=props.page
    }

    type=props.page==='home' ? null : (props.page==='ByLink' ? 'text' : 'file')

    type==='file'?inputType='file':inputType='text'

    return {page,renderedOutput:boxesDivs,type,inputType}
  }
  
  render() {
    console.log('aaaaaaaaaaaaaaaaaa',this.state)
    return (
      <div key={this.props.page} className="flex flex-column items-center">

        <div>
          <h1>{this.state.score}</h1>
        </div>

        {
          this.state.page==='home' ? (null) :
          (
            <div className="w-25 pa3 alignBtns">
              <div>
                <form id='inputForm'>
                  <Button func={this.refresh} text='refresh' />
                </form>
              </div>

              <Button func={this.state.type==='file' ? this.predictFile : this.predictLink} text='Predict' />
              <Input id='input' type={this.state.inputType} onChange={this.state.type==='file' ? this.fileChange : this.linkChange}/>

            </div>
          )
        }

        { this.state.page==='home' ? (null) :
          (
              
            <div className=" ma0 w-25 ">
              <MainImage
                imageStatus={this.state.imageStatus}
                faceBox={this.state.faceBox} 
                show={this.state.page==='home'? false : true}
                showBoxes={this.state.showBoxes}
                type={this.state.imageType}
                link={this.state.link}
                baseURL64={this.state.base64URL}
              />
            </div>
          )
        }

        <HistoryImages page={this.state.page} setData={this.state.page==='home'?null:this.changePath} history={this.props.history}/>
      </div>
    );
  }
}

export default Form;
