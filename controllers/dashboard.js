function authenticate(req){
    if(req.session.isValidUser === undefined || req.session.userId === undefined || req.session.userRole === undefined ){
        return false
    }
    else return req.session.userId
}
module.exports ={
    dashboard: (req, res)=> {
        if(authenticate(req)){
            if(req.session.userRole === "goverment"){
                res.render("govDashboard",{isValid:true,userRole:req.session.userRole})
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