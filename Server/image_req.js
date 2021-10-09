const {getRequestOptions} =require('./prepareAPIrequest')
const {getFaceBox} = require('./getBoundingBoxes')
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 66ccb7f7d75b481ea0d8512f2f4de8cf");

function returnBounds(item){
    return {
        leftcol: item.leftcol  ,
        toprow:item.toprow,
        bottomrow:item.bottomrow ,
        rightcol: item.rightcol,
    }
}

function returnFaceBox(boxes){
    let faceBox=[]
    boxes.forEach(item=>{
        faceBox.push(returnBounds(item))
    })
    return faceBox
}

function getHistory(imagesDataAndIDAndTypes,history){
    imagesDataAndIDAndTypes.forEach(element => {
        let found=false
        let indexIfFound=-1
        if(history.length===0){
            history.push({
                id:element.id,
                type:element.type,
                data: element.image,
                faceBox:[returnBounds(element)]
            })
            console.log('history after pushing',history)
        }else{
            history.forEach((historyElement,index) => {
                if(historyElement.id===element.id){
                    found=true
                    indexIfFound=index
                }
            });
            if(!found){
                history.push({
                    id:element.id,
                    type:element.type,
                    data: element.image,
                    faceBox:[returnBounds(element)]
                })
            }else{
                history[indexIfFound].faceBox.push(returnBounds(element))
            }
        }
        
    });

    return history
}


function insertImageToImages(db,faceBox,id,data,type,mainFaceBox,res){
    db.insert({
        image:data,
        type:type
    })
    .into('images')
    .returning('id')
    .then(async (imageID)=>{
        await db.insert({
            userid:id,
            imageid:imageID[0]
        })
        .into('users_images')
        .returning('imageid')
        .then((imageID)=>{
            faceBox.forEach(item=>{
                bounds=returnBounds(item)
                bounds.imageid=imageID[0]
                db.insert(bounds)
                .into('boxes')
                .catch(err=>{console.log('******',err,'******')})
            })
        })
    })
    .then(async ()=>{
        let history=[]
        return await db.select('*')
        .from('users_images')
        .where('userid','=',id)
        .join('images','users_images.imageid','=','images.id')
        .join('boxes','images.id','=','boxes.imageid')
        .then(async (imagesDataAndIDAndTypes)=>{
            history=getHistory(imagesDataAndIDAndTypes,history)
        })
        .then(()=>{
            db.select('score').from('users').where('id','=',id)
            .then(score=>{
                db.update({score:score[0].score+1})
                .into('users')
                .returning('score')
                .where('id','=',id)
                .then((s)=>{
                    return res.json({
                        score:s[0],
                        history:history,
                        faceBox:mainFaceBox
                    })
                })        
                
            })
        })
    })
}

function checkError(err, response,res){
    if (err) {
        return res.status(400).json(`AaaPI request error : ${err}`)
    }
    if (response.status.code !== 10000) {
        return res.status(400).json(`API request error : ${err}`)
    }
}

function prepareImageResponse(db,id,type, data,res){
    let mainFaceBox=null

    stub.PostModelOutputs(getRequestOptions(data,type),metadata,(err, response) => {

        if (err|| response.status.code !== 10000) {
            return checkError(err, response,res)
        }
        
        let faceBox=getFaceBox(response.outputs[0].data.regions)
        mainFaceBox=faceBox

        return insertImageToImages(db,faceBox,id,data,type,mainFaceBox,res)
        
            
    });
}

module.exports = { prepareImageResponse,returnBounds};