const { connect } = require("mongoose");
const connection = require("../connection");
const getAllSchemes = require('./getData')
module.exports = {
    index: async (req, res) => {
        connection.initWeb3().catch(e=> {
            console.log(e.message);
            req.flash('error', "Cannot connect to network")
        })
        const allSchemes =  connection.initContract().methods.allSchemes().call();
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
            const scheme = await connection.initContract().methods.addScheme(name, date, description,cost).send({from: '0x320f78b8930dAe81880f2F63E7Cf1371a7700aFd', gas:3000000})
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
        const id  = parseInt(req.params.id)
        try {
            const result = await connection.initContract().methods.removeScheme(id).send({from : '0x320f78b8930dAe81880f2F63E7Cf1371a7700aFd'})
            const allSchemes =  await connection.initContract().methods.allSchemes().call();
            res.status(200).json({allSchemes: allSchemes})
            // return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole})

        } catch (error) {
            console.log(error)
            res.status(404).json({error: error})
        }

    }
};
