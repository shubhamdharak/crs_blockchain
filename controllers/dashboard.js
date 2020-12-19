module.exports ={
    dashboard: (req, res)=> {
        if(req.session.isValidUser)
            if(req.session.userRole === "goverment"){
                res.render("govDashboard",{isValid:true,userRole:req.session.userRole})
            }
            else if(req.session.userRole === "vendor"){
                res.render("userDashboard",{isValid:true,userRole:req.session.userRole})
            }
        else{
            req.flash('error', "Session Expired")
            res.redirect("logout")
        }
    },
}