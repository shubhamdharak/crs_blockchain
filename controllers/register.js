const myScheme = require('../models/scheme')
const bcrypt = require('bcrypt')

module.exports = {
    getData:  (req, res) => {
        res.render('register')
    },
    register:  async (req, res) => {
        name = req.body.name
        email = req.body.email
        password1 = req.body.password1
        password2 = req.body.password2
        mobile = req.body.mobile
        accountType = req.body.accountType
        age = req.body.age
        if (password1 === password2 && password1 != "") {
            const emailId = await myScheme.findOne({email:email})
            if(emailId) {
                req.flash('error',"Email already exists, try again")
                return res.redirect('register')
            }
            bcrypt.hash(password1, 10, (err, hash) => {
                if (!err) {
                    user = new myScheme({
                        name: name,
                        password: hash,
                        email: email,
                        mobile: mobile,
                        accountType: accountType,
                        age: age
                    })
                    user.save()
                    req.flash('success', "You have successfully registered!")
                    return res.redirect('login')
                    
                }
                else {
                    req.flash('error', "Something went wrong!, try again")
                    return res.render('register')
                    console.log(err);
                }
            })
        }
        else {
            req.flash('error', "Password doesn't match, try again")
        }
        //res.render('register')
    },
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
    dashboard: (req, res)=> {
        usr = req.session.isValidUser
        if(usr)
            res.render('Dashboard',{isValid:usr})
        else{
            req.flash('error', "Session Expired")
            res.redirect("login")
        }
    },
    logout:(req,res)=>{
        req.session.isValidUser = false
        res.redirect("/")
    },
}

