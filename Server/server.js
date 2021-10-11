const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const knex = require('knex')

const signin=require('./Controller/Signin')
const register=require('./Controller/Register')
const image=require('./Controller/Image')

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

app.post('/signin',(req,res)=>{signin.handleSignin(req,res,bcrypt,db)})
app.post('/register',(req,res)=>{register.handleRegister(req,res,bcrypt,db)})
app.post('/image', async (req, res) =>{image.handleImage(req,res,db)} )

app.listen(8000,()=>{
    console.log('server is listening')
})