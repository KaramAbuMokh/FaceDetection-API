const {returnBounds}=require('../HelpFunctions/image_req')
const handleSignin = (req,res,bcrypt,db)=>{
    let user=null
    
    db.select('*').where('email','=',req.body.email)
    .from('login')
    .then(async (emailPassword)=>{
        if(emailPassword.length && bcrypt.compareSync(req.body.password.toString(), emailPassword[0].hash)){
            return db.select('*').where('email','=',req.body.email)
            .from('users')
            .then( (data)=>{
                user=data[0]
                let history=[]
                return db.select('*')
                .from('users_images')
                .where('userid','=',user.id)
                .join('images','users_images.imageid','=','images.id')
                .join('boxes','images.id','=','boxes.imageid')
                .then(async (imagesDataAndIDAndTypes)=>{

                    imagesDataAndIDAndTypes.forEach(element => {
                        let found=false
                        let indexIfFound=-1
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
                            history[indexIfFound].faceBox.push(returnBounds(element)
                            )
                        }
                    });
                    user.history=history
                    return res.json(user)

                })
                
            })
        }else{
            res.status(400).json('wrong credentials')
        }
    })
    
}


module.exports = { handleSignin };