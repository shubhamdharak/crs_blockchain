const myScheme = require('../models/scheme')
const bcrypt = require('bcrypt')

module.exports = {
    getData: async (req, res)=>{
        const schemas  = await  myScheme.find()
        res.render('register')
    },
    register:  (req, res) => {
        name = req.body.name
        password = req.body.password
        bcrypt.hash(password, 10, (err, hash)=> {
           if(!err) {
                user = new myScheme({name:name, password:hash})
                user.save()
                res.render('register')
           }
           else {
               console.log(err);
           }
        })
    }
}

