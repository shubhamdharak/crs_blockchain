const { default: Web3 } = require('web3')
const connection = require('../connection')


function authenticate(req){
    if(req.session.isValidUser === undefined || req.session.userId === undefined || req.session.userRole === undefined ){
        return false
    }
    else return req.session.userId
}
module.exports ={
    dashboard:  (req, res, next)=> {
        if(authenticate(req)){
            if(req.session.userRole === "Government Officer"){
                connection.initWeb3().then( async ()=> {
                    const allSchemes = await connection.initContract().methods.allSchemes().call()
                    res.render("govDashboard",{isValid:true,userRole:req.session.userRole, allSchemes: allSchemes})
                })
                .catch((e)=> {
                    console.log(e.message)
                    req.flash('error', "Cannot connect to network")
                    res.render("govDashboard",{isValid:true,userRole:req.session.userRole})
                })
                
            }
            else if(req.session.userRole === "vendor"){
                res.render("userDashboard",{isValid:true,userRole:req.session.userRole})
            }
        }
        else{
            req.flash('error', "Invalid Session")
            res.redirect("logout")
        }
    },
}