function authenticate() {
    return (req, res, next)=> {
        if(req.session.isValidUser) {
            next()
        }
        else {
            req.flash('error', 'You are not Authorized user, Please login')
            return res.redirect('/login')
        }
    }
}

module.exports = authenticate()