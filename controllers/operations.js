const { connect } = require("mongoose");
const connection = require("../connection");
const getAllSchemes = require('./getData')
module.exports = {
    index: async (req, res) => {
        connection.initWeb3().catch(e=> {
            console.log(e.message);
            req.flash('error', "Cannot connect to network")
        })
        try {
            const allSchemes =  await connection.initContract().methods.allSchemes().call();
            return res.render('index', {allSchemes: allSchemes})
        } catch(error) {
            console.log(error.message);
            req.flash('error', "Something went wrong!!")
            return res.render('index')
        }

        // allSchemes
        //     .then((r) => {
        //         return res.render('index', {allSchemes: r})
        //     })
        //     .catch((error) => {
        //         req.flash('error',`  something went wrong, please try later`)
        //         console.log(error.message);
        //         return res.render('index')
        //     });
    },
    getAScheme: async (req, res) => {
        connection.initWeb3().catch(e=> {
            console.log(e.message);
            req.flash('error', "Cannot connect to network")
        })
        const scheme_id = parseInt(req.params.id )
        try {
            const scheme = await connection.initContract().methods.getScheme(scheme_id).call();
            res.status(200).json(scheme)
            
        } catch (error) {
            res.status(404).json({error: error})
        }
    },
    addScheme: async (req, res) => {
        const { name, cost, description, date } = req.body
        try {
            const scheme = await connection.initContract().methods.addScheme(name, date, description,cost).send({from: '0xc83DF5D66DBb599072D80bCd9712c6D717eC8528', gas:3000000})
            console.log(scheme);
            const allSchemes = await connection.initContract().methods.allSchemes().call()
            return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole,allSchemes:allSchemes })

        } catch(error) {
            req.flash('error', 'Something wents wrong')
            console.log(error.message);
            return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole})
        }
    },
    deleteScheme: async (req, res)=> {
        const scheme_id  = parseInt(req.params.id)
        try {
            const result = await connection.initContract().methods.removeScheme(scheme_id).send({from : '0xc83DF5D66DBb599072D80bCd9712c6D717eC8528'})
            res.status(200).json({success: "Deleted"})
            // return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole})

        } catch (error) {
            console.log(error)
            res.status(404).json({error: error})
        }

    },
    updateScheme: async (req, res) => {
        const scheme_id = parseInt(req.params.id)
        const scheme = await connection.initContract().methods.getScheme(scheme_id).call()
        .catch(error => {
            console.log(error.message);
            res.send("error")
        })
        res.render('updateScheme', {scheme: "sai"})
    }
};
