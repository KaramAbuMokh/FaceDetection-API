

const handleRegister=(req,res,bcrypt,db)=>{

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

}

module.exports={handleRegister}