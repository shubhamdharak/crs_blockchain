const myScheme = require('../models/scheme')
const bcrypt = require('bcrypt')

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
            const emailId = await myScheme.findOne({ email: email })
            if (emailId) {
                req.flash('error', "Email already exists, try again")
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
}
