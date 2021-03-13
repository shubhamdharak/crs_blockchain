const { default: Web3 } = require("web3");
const connection = require("../connection");
const Transaction = require('../models/TransactionModel')

let sender =  '0xDAE09a20f7FE978Ee3607e0e1Edda7733f937544'

//  Saves transaction history to database for retriving purpose
async function transaction(req, res, scheme) {
    const data = await new Transaction({
        transactionHash : scheme.transactionHash,
        blockNumber : scheme.blockNumber
    })
    .save()
    // .then( async ()=> {
        
        // })
    .catch((error)=> {
        console.log('Add scheme error', error.message);
        req.flash('error', 'Cannot add sheme')
        return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole })
    })
    return true
}

module.exports = {
    index: async (req, res) => {
        connection.initWeb3().catch(e=> {
            console.log(e.message);
            req.flash('error', "Cannot connect to network")
        })
        const result = await module.exports.allSchemes(req, res)
        res.render('index',{ allSchemes: result})
        
    },
    allSchemes : async (req, res)=> {
        try {
            const allSchemes =  await connection.initContract().methods.allSchemes().call();
            return allSchemes;
        } catch(error) {
            console.log(error.message);
            req.flash('error', "Something went wrong!!")
            return error.message;
        }
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
            const scheme = await connection.initContract().methods.addScheme(name, date, description,cost).send({from: sender, gas:3000000})
            console.log(scheme);
            transaction(req, res, scheme)
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
            const result = await connection.initContract().methods.removeScheme(scheme_id).send({from : sender})
            transaction(req, res, result)
            res.status(200).json({success: "Deleted"})

        } catch (error) {
            console.log(error)
            res.status(404).json({error: error})
        }

    },
    updateScheme: async (req, res) => {
        const {scheme_id, name, cost, description, date} = req.body
        try {
            const result = await connection.initContract().methods.updateScheme(scheme_id, name, description, date,cost).send({from: sender})
            transaction(req, res, result)
            const allSchemes = await connection.initContract().methods.allSchemes().call()
            return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole, allSchemes:allSchemes})

        } catch (error) {
            console.log(error.message);
            req.flash('error', 'Updating scheme fails due to errors')
            return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole})
        }
    },
    getAMaterial : async (req, res)=> {
        const material_id = parseInt(req.params.id )
        try {
            const material = await connection.initContract().methods.getMaterial(material_id).call();
            res.status(200).json(material)
            
        } catch (error) {
            res.status(404).json({error: error})
        }
    },
    addMaterial : async (req, res)=> {
        const { name, cost } = req.body
        try {
            const material = await connection.initContract().methods.addMaterial(name, sender,cost).send({from: sender, gas:3000000})
            console.log(material);
            transaction(req, res, material)
            const allMaterials = await connection.initContract().methods.allMaterials().call()
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole,allMaterials:allMaterials })

        } catch(error) {
            req.flash('error', 'Something wents wrong')
            console.log(error.message);
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole})
        }
    },
    deleteMaterial : async (req, res)=> {
        const material_id  = parseInt(req.params.id)
        try {
            const result = await connection.initContract().methods.removeMaterial(material_id).send({from : sender})
            transaction(req, res, result)
            res.status(200).json({success: "Deleted"})

        } catch (error) {
            console.log(error)
            res.status(404).json({error: error})
        }

    },
    updateMaterial : async (req, res)=> {
        const {Material_id, name, cost} = req.body
        try {
            const result = await connection.initContract().methods.updateMaterial(Material_id,name,sender,cost).send({from: sender})
            transaction(req, res, result)
            const allMaterials = await connection.initContract().methods.allMaterials().call()
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole, allMaterials:allMaterials})

        } catch (error) {
            console.log(error.message);
            req.flash('error', 'Updating scheme fails due to errors')
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole})
        }
    },
    transactions : async (req, res) => {
        const allTransactions = await Transaction.find()
        res.render('Transactions', {allTransactions : allTransactions})
    },
    getTransaction: async (req, res)=> {
        const hash = req.params.hash
        const data = await global.web3.eth.getTransaction(hash)
        .catch((error=> console.log(error.message)))
        return res.status(200).json({data: data})
    }
};
