module.exports ={
    dashboard: (req, res)=> {
        usr = req.session.isValidUser
        if(usr)
            res.render('Dashboard',{isValid:usr})
        else{
            req.flash('error', "Session Expired")
            res.redirect("logout")
        }
    },
}