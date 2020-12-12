const myScheme = require('../models/scheme');
const bcrypt = require('bcrypt');

module.exports = {
    login: (req, res)=> {
        res.render('login')
    },
    postLogin: async (req, res)=> {
        const email = req.body.email
        const user = await myScheme.findOne({email:email})
        if(user) {
            //bcrypt.hash(req.body.password,10,(err,hash)=>{console.log(hash)})
            bcrypt.compare(req.body.password, user.password, (err, result)=> {
                if(result){
                   req.session.isValidUser = true
                   req.session.userId = user.id;
                   req.session.userRole = user.accountType;
                   req.flash('success', "Welcome, "+user.name)
                   return res.redirect('Dashboard')
                }
                else{
                    req.flash('error', "Password not match")
                    return res.render('login')
                }
            })
            //return res.redirect('login')
        }
        else {
            req.flash('error', "User not found")
            return res.redirect('login')
        }
        //res.render("login")
    },
    logout:(req,res)=>{
        req.session.isValidUser = false
        res.redirect("/")
    },
   
}
