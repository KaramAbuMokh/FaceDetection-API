const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const {getRequestOptions} =require('./prepareAPIrequest')
const {addToScore, getFaceBox} = require('./getBoundingBoxes')
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const knex = require('knex')

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


const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 66ccb7f7d75b481ea0d8512f2f4de8cf");


let database={
    users:[
    ]
}

const app = express()
//app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors())


// signin
 app.post('/signin',(req,res)=>{
    let found=false
    let resultIndex=null

    // db.select('*').where('email','=',req.body.email)
    // .from('login')
    // .then(user=>{
    //     if(user.length && bcrypt.compareSync(user.password, user[0].hash)){
    //         res
    //     }else{
    //         res.status(400).json('wrong credentials')
    //     }
        
    // })

    // check if email is exist
    database.users.forEach((element,index) => {
        if(element.email===req.body.email){
            found=true
            resultIndex=index
        }
    })

    // if not found , that means if not exist
    if(!found){
        res.json("fail")
        return
    }

    let element=database.users[resultIndex]

    // make hash for the password
    bcrypt.compare(req.body.password.toString(), element.password, function(err, result) {
        if(err){
            console.log('error occured',err)
        }

        if(result){
            found=true
            res.json(element)
            return
        }else{
            res.json('fail')
            return
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



    // database.users.forEach(element => {
    //     if(element.email===req.body.email ){
    //         return res.status(400).json('this email is already registered')
    //     }
    // });

    // bcrypt.hash(user.password.toString(), 10, function(err, hash) {
    //     user.password=hash
    //     user.id=database.users.length+1
    //     database.users.unshift(user)
    //     console.log(database.users)
    //     res.json('success')
    // })
})


// ---------- profile
app.post('/profile/:id',(req,res)=>{
    const {id}=(req.params)
    let found=false

    database.users.forEach(element => {
        if(element.id===Number(id)){
            found=true
            return res.json(element)
        }
    });

    if(!found){
        res.status(400).json('not found')
    }
})


function getUserAndIndex(id){
    for (let index = 0; index < database.users.length; index++) {
        if(String(database.users[index].id)===String(id)){
            return {user:database.users[index], index:index}
        }        
    }
    return null
}


// predict
app.post('/image',(req,res)=>{
    const {id,data,type}=req.body;

    stub.PostModelOutputs(getRequestOptions(data,type),metadata,(err, response) => {
        if (err) {
            return res.status(400).json(`AaaPI request error : ${err}`)
        }
        if (response.status.code !== 10000) {
            console.log(response)
            return res.status(400).json(`API request error : ${err}`)
        }
                
        let faceBox=getFaceBox(response.outputs[0].data.regions)
        let userAndIndex=getUserAndIndex(id)

        if(userAndIndex===null){
            return res.status(400).json(`User not found`)
        }
        let user=addToScore(userAndIndex.user,data,type,faceBox)
        database[userAndIndex.index]=user

        return res.json({
            score:user.score,
            history:user.history,
            faceBox:faceBox
        })
        
    });
    
})


app.listen(8000,()=>{
    console.log('server is listening')
})