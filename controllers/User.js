const regSchema = require('../models/scheme').regSchema
const bcrypt = require('bcrypt')
const mail = require('../controllers/mail')

module.exports = {
    getData: (req, res) => {
        res.render('register')
    },
    register: async (req, res) => {
        name = req.body.name
        email = req.body.email
        password1 = req.body.password1
        password2 = req.body.password2
        mobile = req.body.mobile
        accountType = req.body.accountType
        age = req.body.age
        if (password1 === password2 && password1 != "") {
            const emailId = await regSchema.findOne({ email: email })
            if (emailId) {
                req.flash('error', "Email already exists, try again")
                return res.redirect('register')
            }
            bcrypt.hash(password1, 10, (err, hash) => {
                if (!err) {
                    user = new regSchema({
                        name: name,
                        password: hash,
                        email: email,
                        mobile: mobile,
                        accountType: accountType,
                        age: age,
                        accVerified : false
                    })
                    user.save().then(async function(ress,er){
                        url = req.protocol + '://' + req.get('host')+"/VerifyMail?tokens="+ress.id;
                        curl = req.protocol + '://' + req.get('host')+"/contact"
                        cnf_mail = require('./mail_templates/acc_verification')
                        await mail.send(email,"Account Verification - [CRS-BT]",cnf_mail.getTemplate(name,url,curl))
                        .then(function(msg){if(msg){
                            req.flash('success', "You have successfully registered..!")
                            req.flash('warning','Please Verify your Email Address')
                            req.flash('infos',`We Have Send Verification Email to : ${ress.email}`)
                            return res.redirect('login')
                        }})
                        .catch(function(err){
                            const myquery = { "_id": ress.id};
                            user.remove(myquery)
                            req.flash("error","E-mail Sending Failed...please Re-Register")
                            console.log(err);
                            res.redirect("register")
                        })
                    })

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
}
