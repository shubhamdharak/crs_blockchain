const connection = require('../connection');
const operations = require('./operations');
const Notification = require('../models/notifications');
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
                    const allUsers = await operations.getUsers();
                    res.render("govDashboard",{isValid:true,userRole:req.session.userRole, allSchemes: allSchemes, allUsers:allUsers})
                })
                .catch((e)=> {
                    console.log(e.message)
                    req.flash('error', "Cannot connect to network")
                    res.render("govDashboard",{isValid:true,userRole:req.session.userRole})
                })
                
            }
            else if(req.session.userRole === "vendor"){
                const allMaterials = await connection.initContract().methods.allMaterials().call()
                res.render("userDashboard",{isValid:true,userRole:req.session.userRole,allMaterials:allMaterials})
            }
            else if(req.session.userRole === "contractor"){
                const allSchemes = await connection.initContract().methods.allSchemes().call()
                const allNoty = await Notification.find();
                res.render("contractorDash",{isValid:true,userRole:req.session.userRole, allSchemes: allSchemes,allNoty:allNoty})
            }
        }
        else{
            req.flash('error', "Invalid Session")
            res.redirect("logout")
        }
    }
    
}