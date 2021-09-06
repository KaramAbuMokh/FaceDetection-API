import React from "react";
import Clarifai from "clarifai";
import HistoryImages from './HistoryImages'
import MainImage from "./MainImage";
import Button from './Button'
import Input from './Input'
import { hslToHsv } from "tsparticles/Utils";



class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state={
        score:props.user.score,
        history:[],
        faceBox:[],
        showMainImage:false,
        data:null,
        mainImageType:null,
        fromHistory:false,
        showInput:false,
        page:props.page,
        inputType:null
      }


    this.linkChange = this.linkChange.bind(this);    
    this.addToScore = this.addToScore.bind(this);
    this.refresh = this.refresh.bind(this);
    this.fileChange = this.fileChange.bind(this);
  }


  linkChange(event) {
    this.setState({
      faceBox:[],
      showMainImage:true,
      data:event.target.value,
      mainImageType:'link',
      fromHistory:false
    })
  }


  fileChange(event) {
    this.setState({
      faceBox:[],
      showMainImage:true,
      data:this.getBase64(event.target.files[0]),
      mainImageType:'file',
      fromHistory:false,
    })
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

  addToScore(){

    

    for (let index = 0; index < this.state.history.length; index++) {
      const element = this.state.history[index];
      if(this.state.data===element.data){
        
        this.setState({faceBox:element.faceBox})
        console.log('ccccccccccccccc',this.state)
        return
      }
    }

    fetch('http://localhost:8000/image',{
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body:JSON.stringify({
        id: this.props.user.id,
        type:this.state.mainImageType,
        data: this.state.data
        
      })
    })
    .then(response => response.json())
    .then( data => {

      console.log('bbbbbbbbbbb',data)

      let user=this.props.user
      user.history=data.history
      user.score=data.score
      this.props.setUser(user)
      
      this.setState({score:data.score, history:data.history,faceBox:data.faceBox})

      console.log('after getting the facebox',this.state)

    })
    .catch(err=>console.log('errrr:',err))
  }

  refresh=()=>{
    let input=null
    if(this.state.mainImageType==='link'){
      input=document.getElementById('text');
      input.value=null
      
    }else if(this.state.mainImageType==='file'){
      input=document.getElementById('file');
      input.files=null
    }

    this.setState({
      faceBox:[],
      showMainImage:false,
      data:null,
      fromHistory:false,
    })
  }

  changePath=(link,type,faceBox)=>{
    this.setState({
      showMainImage:true,
      data:link,
      mainImageType:type,
      faceBox:faceBox,
      fromHistory:true,
    })
  }


  static getDerivedStateFromProps(props, state){

    let faceBox= state.faceBox
    console.log(faceBox)
    let boxesDivs = faceBox.map((item,i) => <div key={i} className='bounding-box' style={{top: (item.topRow*100)+'%', bottom: (100-item.bottomRow*100)+'%' , left: (item.leftCol*100)+'%', right: (100-item.rightCol*100)+'%' }}></div> )
    
    // change parameters depends on the page name
    let page=state.page
    let score=props.user.score
    let showMainImage=state.showMainImage
    let data=state.data
    let mainImageType=state.mainImageType
    let fromHistory=state.fromHistory
    let showInput=state.showInput
    let inputType=state.inputType


    if(props.page!==page){

      score=props.user.score
      faceBox=[]
      showMainImage=false
      data=''
      mainImageType=null
      fromHistory=false
      showInput=true
      page=props.page
    }
    if(page==='home'){
      inputType=null
      showInput=false
    }else if(page==='ByLink'){
      inputType='text'
    }else{
      inputType='file'
    }

    return {
      page,
      score,
      showMainImage,
      data,
      mainImageType,
      faceBox,
      fromHistory,
      showInput,
      page,
      renderedOutput:boxesDivs,
      inputType
    }
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

              <Button func={this.addToScore} text='Predict' />
              <Input type={this.state.inputType} onChange={this.state.inputType==='file' ? this.fileChange : this.linkChange}/>

            </div>
          )
        }

        { this.state.showMainImage ? (
              
              <div className=" ma0 w-50 ">
                <MainImage
                  data={this.state.data}
                  renderedOutput={this.state.renderedOutput}
                />
              </div>
            ):(null)
        }

        <HistoryImages page={this.state.page} setData={this.changePath} history={this.state.history}/>
      </div>
    );
  }
}

export default Form;
