const { default: Web3 } = require("web3");
const connection = require("../connection");
const Transaction = require('../models/TransactionModel');
const {regSchema} = require('../models/scheme')

let sender =  '0x5C9bd825c7a197E8B0d0d89f6655765Ca1303e07'

//  Saves transaction history to database for retriving purpose
async function transaction(req, res, scheme) {
    const data = await new Transaction({
        transactionHash : scheme.transactionHash,
        blockNumber : scheme.blockNumber
    })
    .save()

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
        const allSchemes = await module.exports.allSchemes(req, res)
        res.render('index',{ allSchemes: allSchemes})
        
    },
    allSchemes : async (req, res)=> {
        try {
            const allSchemes =  await connection.initContract().methods.allSchemes().call();
            return allSchemes
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
            req.flash("success","Scheme added successfully!")
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
            req.flash("success", "Scheme updated!")
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
            req.flash("success", "Materal added successfully")
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
            req.flash("success", "Material updated!")
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
    },
    makeBid : async (req, res)=> {
        const { contract_id, bidAmount } = req.body
        const userId = req.session.userId;
        let user;
        try {
            user = await regSchema.findOne({_id: userId});
        } catch (error) {
            console.log(error.message);
            req.flash('error', error.message);
        }
        
        console.log(user.name);
        if(req.session.userRole === "contractor") {
            try {
                const bid = await connection.initContract().methods.bidContract(sender, contract_id, bidAmount,user.name).send({from: sender, gas: 3000000});
                console.log(bid);
                if(Object.keys(bid.events).length === 0) {
                    return res.status(400).json("Cannot add bid (Bid amount exceeded)")
                }
                return res.status(200).json("Bid added successful!")
            } catch(err) {
                console.log(err.message);
                return res.status(400).json("Cannot add bid ");
            }
        } else {
            return res.status(401).json("Access Denied!")
        }
    },
    getAllBids: async ()=> {
        const allBids = await connection.initContract().methods.getAllBids().call();
        return allBids;
    },
    approveBid: async (req, res)=> {
        const { bid_id, contractId} = req.body
        const result = await connection.initContract().methods.allocateContract(contractId, sender, bid_id).send({from: sender});
        console.log(result);
        return true;
    },
    getBid: async (req, res)=> {
        const {contract_id} = req.params
        const bid = await connection.initContract().methods.getABid(contract_id).call();
        return res.status(200).json({bid: bid})
    }
};
