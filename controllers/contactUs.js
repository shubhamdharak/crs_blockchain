let contactQueries = require('../models/scheme').contactSchema;
var fs = require('fs');
const mail = require('./mail')

module.exports = {
    getPage:(req,res)=>{
        res.render("contact")
    },
    storeQuery:async (req,res)=>{
        name = req.body.name
        email = req.body.email
        mobile = req.body.mobile
        query = req.body.query
        if(name==""){
            req.flash('error', "Please Enter Name")
            return res.redirect('contact')
        }else if(email==""){
            req.flash('error', "Please enter Email address")
            return res.redirect('contact')
        }else if(mobile==""){
            req.flash('error', "Please enter Mobile Number")
            return res.redirect('contact')
        }else if(query==""){
            req.flash('error', "Please enter Valid Query")
            return res.redirect('contact')
        }else{
            let user = false
            if(req.session.userId){
                user = req.session.userId
            }
            const user1 = await regSchema.findOne({ email: email })
            if(user1){
                user = user1.id
            }
            query = new contactQueries({
                name:name,
                email:email,
                mobile:mobile,
                query:query,
                isUser:user,
                querySts:"New",
                querySolution:"NA"
            })

            query.save()
            .then(async function(result){
                url = req.protocol + '://' + req.get('host')+"/QueryStatus?tokens="+result.id;
                curl = req.protocol + '://' + req.get('host')+"/contact"
                qry_mail = require('./mail_templates/qry_mail')
                await mail.send(result.email,"New Query - [CRS-BT]",qry_mail.getTemplate(result.id,name,url,curl,result.email,result.querySts))
                .then(function(){
                    console.log("OK")
                    req.flash("success","Your Query is registered with our system successfully, Team CRS-BT will shortly contact you at "+result.email)
                    req.flash("infos","Your query registration tokens are "+result.id)
                    console.log("Query Registered....!"+result.id)
                    res.redirect("/")
                }).catch(function(){
                    const myquery = { "_id": result.id};
                    query.remove(myquery)
                    console.log("Mail sending failed")
                    req.flash("error","Error While registering query")
                    res.render("contact")
                })
            })
            .catch(function(){
                console.log("Error while Registering Query")
                req.flash("error","Error While registering query")
                res.render("contact")
            })
        }
    },
    trackQuery:async (req,res)=>{
        try{
            const result = await contactQueries.findOne({ "_id": req.query.tokens })
            res.render("trackqueries",{qry:result})
        }
        catch{
            console.log("Invalid Tokens")
        }
    }
}