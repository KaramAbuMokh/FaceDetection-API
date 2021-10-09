const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const knex = require('knex')
const {returnBounds}=require('./image_req')

const db =knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'alphateam',
    database : 'postgres'
  }
});

const app = express()
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors())

// signin
 app.post('/signin',(req,res)=>{
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
    
})

// --------- register
app.post('/register',(req,res)=>{

    let user=req.body
    const saltRounds = 10;
    const myPlaintextPassword = user.password.toString();
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

    db.transaction(trx=>{
        trx.insert({
            email:user.email,
            hash:hash
        })
        .into('login')
        .returning('email')
        .then(emailLogin=>{
            return trx('users')
            .returning('*')
            .insert({
                email:emailLogin[0],
                name:user.name,
                joining:new Date,
                score:0
            })
            .then(user=>{
                console.log(user)
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })

})

app.post('/image', async (req, res) => {
    const {id,type, data} = req.body;
    const {prepareImageResponse} =require('./image_req')
    prepareImageResponse(db,id,type, data,res)
})

app.listen(8000,()=>{
    console.log('server is listening')
})