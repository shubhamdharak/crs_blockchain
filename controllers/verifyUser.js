const regSchema = require('../models/scheme').regSchema
const bcrypt = require('bcrypt')

module.exports = {
    verify:async (req,res)=>{
        try{
            const hash1 = await regSchema.findOne({ "_id": req.query.tokens })
            if(hash1.accVerified == false){
                var myquery = { "_id": req.query.tokens };
                var newvalues = { $set: {accVerified:true} };
                regSchema.updateOne(myquery,newvalues,function(err,result){
                    if(err) throw err;
                    res.send("Your Account Has Been Verified Successfully / "+hash1.name+"<br><br>Now you can <a href='login'>Login</a> to your Account")
                })
            }
            else if(hash1.accVerified == true){
                res.send("Account Already Verified...! / "+hash1.name+"<br><br>Now you can <a href='login'>Login</a> to your Account")
            }
            else{
                res.send("Something Wrong..! <br><br>please <a href='contact'>Contact us</a>")
            }
        }catch{
            res.send("<a style='color:red'>Invalid Tokens</a>")
        }
    }
}