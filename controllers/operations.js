const connection = require("../connection");

module.exports = {
    getAllSchemes: async (req, res) => {
        connection.initWeb3().catch(e=> {
            console.log(e.message);
            req.flash('error', "Cannot connect to network")
            return render('index')
        })
        const allSchemes = connection.initContract().methods.allSchemes().call();
        allSchemes
            .then((r) => {
                res.render('index', {allSchemes: r})
            })
            .catch((error) => {
                req.flash('error',`  something went wrong, please try later`)
                console.log(error.message);
                return res.render('index')
            });
    },
};
