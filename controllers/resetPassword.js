const jwt = require('jwt-simple');
const regSchema = require('../models/scheme').regSchema
const mail = require('./mail')
const bcrypt = require('bcrypt')

const expiry = 120


module.exports = {
    forgotPassword:async (req,res)=>{
        try{
            const user = await regSchema.findOne({ email: req.body.email })
            if(user){
                const token = jwt.encode({email:req.body.email, generateOn:Date.now()},process.env.SECRET)
                const url = req.protocol + '://' + req.get('host')+"/ResetPassword/"+token
                const curl = req.protocol + '://' + req.get('host')+"/contact"
                res_mail = require('./mail_templates/reset_mail')
                await mail.send(user.email,"Reset Password - [CRS-BT]",res_mail.getTemplate(url,curl,expiry))
                .then(function(){
                    req.flash("success","Reset Link Has been send to : "+user.email)
                    res.redirect("login")
                })
                .catch(function(){
                    console.log("Mail Sending Failed")
                })
            }
            else{
                req.flash("error","User not Found")
                res.redirect("login")
            }
        }
        catch{
            req.flash("error","Something went wrong")
        }
    },
    reset:async(req,res)=>{
        try{
            data = jwt.decode(req.params.token, process.env.SECRET)
            if(((Date.now() - data.generateOn)/60000) > expiry){
                req.flash("error","Tokens Expired")
                res.redirect("/login")
            }
            else{
                req.session.jwt = req.params.token
                res.render("reset")
            }
        }catch{
            req.flash("error","Invalid Tokens")
            res.redirect("/login")
        }
    },
    setNewPwd:async(req,res)=>{
        password1 = req.body.password1
        password2 = req.body.password2
        if (password1 === password2 && password1 != "") {
            bcrypt.hash(password1, 10, async (err, hash) => {
                if (!err) {
                    try{
                        data = jwt.decode(req.session.jwt, process.env.SECRET)
                        if(((Date.now() - data.generateOn)/60000) > expiry){
                            req.flash("error","Tokens Expired")
                            res.redirect("/login")
                        }
                        else{
                            result = await regSchema.updateOne({email:data.email},{password:hash})
                            if(result.n == 1 && result.nModified == 1 && result.ok==1){
                                req.flash("success","Password Reseted Successfully")
                                res.redirect("/login")
                                req.session.destroy(function(ree){
                                    console.log(`Password Reset Session Destroyed [user : ${data.email}]`)
                                })
                            }else{
                                req.flash("error","Something went wrong")
                                res.render("reset")
                            }
                        }
                    }catch{
                        req.flash("error","Invalid Tokens")
                        res.redirect("/login")
                    }
                }
                else{
                    req.flash("error","Something went Wrong")
                    res.render("reset")
                }
            })
        }
        else{
            req.flash("error","Password doesn't match, try again")
            res.render("reset")
        }
    }
}