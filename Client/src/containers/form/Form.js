import React from "react";
import HistoryImages from './templates/HistoryImages'
import MainImage from "./templates/MainImage";
import Button from './templates/Button'
import Input from './templates/Input'



class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state={
        score:props.user.score,
        history:props.history,
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
    this.getBase64(event.target.files[0]).then(result=>{this.setState({data:result.replace('data:image/jpeg;base64,','')} )})
    this.setState({
      faceBox:[],
      showMainImage:true,
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

      console.log('returned data after predection',data)

      let user=this.props.user
      user.history=data.history
      user.score=data.score
      console.log('the history in form class before setUser',this.state.history)
      this.props.setUser(user)
      this.setState({
        history:user.history
      })
      console.log('the history in form class after setUser',this.state.history)
      
      this.setState({score:data.score, history:data.history,faceBox:data.faceBox})
    })
    .catch(err=>console.log('errrr:',err))
  }

  refresh=()=>{
    let input=null
    if(this.state.inputType==='text'){
      input=document.getElementById('text');
      input.value=null
      
    }else if(this.state.inputType==='file'){
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
    let boxesDivs = faceBox.map((item,i) => <div key={i} className='bounding-box' style={{top: (item.toprow*100)+'%', bottom: (100-item.bottomrow*100)+'%' , left: (item.leftcol*100)+'%', right: (100-item.rightcol*100)+'%' }}></div> )
    
    // change parameters depends on the page name
    let page=state.page
    let score=props.user.score
    let showMainImage=state.showMainImage
    let data=state.data
    let mainImageType=state.mainImageType
    let fromHistory=state.fromHistory
    let showInput=state.showInput
    let inputType=state.inputType

    let history=props.history


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
      inputType,
      history
    }
  }
  
  render() {
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
                  type={this.state.mainImageType}
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
