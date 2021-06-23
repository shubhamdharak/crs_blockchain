const connection = require('../connection');
const operations = require('./operations');
const Notification = require('../models/notifications');
const {regSchema} = require('../models/scheme');
const Material = require('../models/material')
const Quotation = require('../models/quatation');
const Bids = require('../models/bid');

function authenticate(req){
    if(req.session.isValidUser === undefined || req.session.userId === undefined || req.session.userRole === undefined ){
        return false
    }
    else return req.session.userId
}
module.exports ={
    dashboard: async (req, res, next)=> {
        if(authenticate(req)){
            if(req.session.userRole === "Government Officer"){
                connection.initWeb3().then( async ()=> {
                    const allSchemes = await connection.initContract().methods.allSchemes().call();
                    const allUsers = await regSchema.find();
                    res.render("govDashboard",{isValid:true,userRole:req.session.userRole, allSchemes: allSchemes, allUsers:allUsers})
                })
                .catch((e)=> {
                    console.log(e.message)
                    req.flash('error', "Cannot connect to network")
                    res.render("govDashboard",{isValid:true,userRole:req.session.userRole})
                })
                
            }
            else if(req.session.userRole === "vendor"){
                const allNoty = await Notification.find();
                const allMaterials = await Material.find();
                const allQuotation = await Quotation.find()
                res.render("userDashboard",{isValid:true,userRole:req.session.userRole,allMaterials:allMaterials, allNoty:allNoty,allQuotation:allQuotation})
            }
            else if(req.session.userRole === "contractor"){
                const allSchemes = await connection.initContract().methods.allSchemes().call()
                const allNoty = await Notification.find();
                const allMaterial = await Material.find();
                let allBids = await Bids.find({contractor_name: req.cookies.user_name})
                const allQuotation = await Quotation.find({contractor_name: req.cookies.user_name})
                res.render("contractorDash",{isValid:true,userRole:req.session.userRole, allSchemes: allSchemes,allNoty:allNoty,allMaterial:allMaterial,allBids:allBids,allQuotation:allQuotation})
            }
        }
        else{
            req.flash('error', "Invalid Session")
            res.redirect("logout")
        }
    }
    
}