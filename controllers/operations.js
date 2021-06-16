const { default: Web3 } = require("web3");
const connection = require("../connection");
const Transaction = require('../models/TransactionModel');
const {regSchema} = require('../models/scheme');
const Bids = require('../models/bid');
const { trackQuery } = require("./contactUs");
const Contract = require('../models/contract');
const Material = require('../models/material');
const Notification = require('../models/notifications');
const fundSchema = require('../models/fund');
const progress = require("../models/progress");


let sender =  '0x6c72f47049b7fd88aa909793506997459D523DC9'

//  Saves transaction history to database for retriving purpose
async function transaction(req, res, scheme, activity) {
    const data = await new Transaction({
        transactionHash : scheme.transactionHash,
        blockNumber : scheme.blockNumber,
        activity: activity
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
        const allNoty = await module.exports.getNotification(req, res);
        res.render('index',{ allSchemes: allSchemes, allNoty: allNoty})
        
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
        const fileName = req.file.originalname;
        try {
            const scheme = await connection.initContract().methods.addScheme(name, date, description,cost, fileName).send({from: sender, gas:3000000})
            console.log(scheme);
            transaction(req, res, scheme, 'Add Scheme') // Add to transaction  collection
            const allSchemes = await connection.initContract().methods.allSchemes().call();
            const contractCount = await connection.initContract().methods.schemeCount().call();
            // add scheme to database
            const contract = await new Contract({
                contract_id : contractCount,
                contract_name : name,
                description : description,
                date: date,
                address :sender,
                cost : cost,
                path : fileName
            }).save();
            req.flash("success","Scheme added successfully!")

            const allUsers  = await regSchema.find();
            return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole,allSchemes:allSchemes, allUsers:allUsers })

        } catch(error) {
            req.flash('error', 'Something wents wrong')
            console.log(error.message);
            const allUsers  = await regSchema.find();
            return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole, allUsers:allUsers})
        }
    },
    deleteScheme: async (req, res)=> {
        const scheme_id  = parseInt(req.params.id)
        try {
            const result = await connection.initContract().methods.removeScheme(scheme_id).send({from : sender});
            // Delete  data in db
            Contract.deleteOne({contract_id: scheme_id}, function(err) {
                    if(err) {
                        console.log(err.message);
                        return req.flash("error",err.message);
                    }
                    console.log("Deleted successful...");
                    return true;
                });
            transaction(req, res, result, 'Delete Scheme')
            res.status(200).json({success: "Deleted"})

        } catch (error) {
            console.log(error)
            res.status(404).json({error: error})
        }

    },
    updateScheme: async (req, res) => {
        const {scheme_id, name, cost, description, date} = req.body;
        const fileName = req.file.originalname;

        try {
            const result = await connection.initContract().methods.updateScheme(scheme_id, name, description, date,cost, fileName).send({from: sender})
            transaction(req, res, result, 'Update Scheme')
            const allSchemes = await connection.initContract().methods.allSchemes().call();
            // Update the values in db
            try {
                const contract = await  Contract.findOneAndUpdate({contract_id:scheme_id},{
                    contract_name : name,
                    description : description,
                    date: date,
                    address :sender,
                    cost : cost,
                    path : fileName
                }, {new:true})

            } catch (error) {
                console.log(error.message);
            }
            req.flash("success", "Scheme updated!")
            const allUsers  = await regSchema.find();
            return  res.render("govDashboard",{isValid:true,userRole:req.session.userRole, allSchemes:allSchemes, allUsers:allUsers})

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
            const result = await connection.initContract().methods.addMaterial(name, sender,cost).send({from: sender, gas:3000000})
            const materialCount = await connection.initContract().methods.materialCount().call();
            console.log(result);
            const mat = await new Material({
                material_id: materialCount,
                name: name,
                cost: cost
            }).save();
            transaction(req, res, result, "Add Material");
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
            Material.deleteOne({material_id: material_id}, function(err) {
                if(err) {
                    console.log(err.message);
                    return req.flash("error",err.message);
                }
                console.log("Deleted successful...");
                return true;
            });
            transaction(req, res, result, 'Delete Material')
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
            transaction(req, res, result, 'Material Update')
            const allMaterials = await connection.initContract().methods.allMaterials().call()

            const mat = await  Material.findOneAndUpdate({material_id:Material_id},{
                name: name,
                cost: cost
            }, {new:true})

            transaction(req, res, result, "Update Material")
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
        const allUsers = await regSchema.find();
        res.render('Transactions', {allTransactions : allTransactions,allUsers:allUsers})
    },
    getTransaction: async (req, res)=> {
        const hash = req.params.hash
        const data = await global.web3.eth.getTransaction(hash)
        .catch((error=> console.log(error.message)))
        return res.status(200).json({data: data})
    },
    makeBid : async (req, res)=> {
        const { contract_id, bidAmount, contract_name } = req.body
        console.log(contract_name);
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
                const bidCount = await connection.initContract().methods.bidCount().call();
                // entry to db
                const bidDb = await new Bids({
                    bid_id : bidCount,
                    bid_amount: bidAmount,
                    contract_id:  contract_id,
                    contract_name: contract_name,
                    contractor : sender,
                    contractor_name : req.cookies.user_name
                }).save();
                console.log(bidDb)
                transaction(req, res, bid, "Add Bid")
                if(Object.keys(bid.events).length === 0) {
                    Bids.deleteOne({_id: bidDb._id}, function(err) {
                        if(err) {
                            console.log(err.message);
                        }
                        console.log("successful deleted");
                    });
                    return res.status(400).json("Cannot add bid (Bid amount exceeded) or already approved")
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
        const { bid_id, contractId, bidAmount} = req.body
        const result = await connection.initContract().methods.allocateContract(contractId, sender, bid_id).send({from: sender});
        console.log(result);
        // update isAppoved in db
        try {
        const bid = await  Bids.findOneAndUpdate({bid_id:bid_id},{
            isApprove: true
        }, {new:true})
        console.log(bid) ;
        } catch (error) {
            console.log(error.message);
        }
        transaction(req, res, result, "Approved Bid");
        return true;
    },
    getBid: async (req, res)=> {
        const {contract_id} = req.params
        const bid = await connection.initContract().methods.getABid(contract_id).call();
        return res.status(200).json({bid: bid})
    },
    deleteBid: async (req, res)=> {
        try {
            const {bidId} = req.params
            console.log(bidId);
            const bid = await connection.initContract().methods.deleteBid(bidId).send({from:sender});
 
                Bids.deleteOne({bid_id: bidId}, function(err) {
                    if(err) {
                        console.log(err.message);
                        return req.flash("error",err.message);
                    }
                    console.log("Deleted successful...");
                    return true;
                });
                transaction(req, res, bid, "Delete Bid")
            return true;
        } catch(error) {
            console.log(error.message);
            return false;
        }

    },
    getUsers : async (req, res)=> {
        try {
            const allUsers = await regSchema.find();
            return allUsers;
        } catch (error) {
            console.log(error.message);
        }
    },
    notification: async (req, res)=> {
        const { title, description } = req.body;
        try {
            const notification = await new Notification({
            name: title,
            description:description
        }).save();
        // req.flash('success', 'Notification has been added!');
        transaction(req, res, notification, "Notification Added")
        return res.json({'success':'Added new Notification'})
        } catch (error) {
            console.log(error.message);
            return req.flash('error', error.message);
        }
    },
    getNotification: async (req, res)=> {
        try {
            const allNoty = await Notification.find();
            console.log(allNoty);
            return allNoty;
        } catch (error) {
            console.log(error.message);
        }
    },
    addFund: async (req, res)=> {
        const {fcontract_id, fbid_id, amount, fcontractor_name } = req.body;
        try {
            const fund = await connection.initContract().methods.giveFund(amount, fcontractor_name, fcontract_id, fbid_id).send({from:sender, gas:3000000});
            const fundCount = await connection.initContract().methods.fundCount().call();
            const funds = await new fundSchema({
                fund_id : fundCount,
                contract_id : fcontract_id,
                contractor_name: fcontractor_name,
                bid_id : fbid_id,
                amount : amount,
                isAllocated : true
            }).save();
            transaction(req, res, fund, "Fund Added")
            return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    },
    addProgress: async (req, res)=> {
        const {fund , status, bidID, contractName, contractorName } = req.body;
        const wimage = req.files;
        let images ='';

        wimage.forEach(image => {
            images = images +' '+ image.filename;
        });
        
        // console.log(fund, images, status);
        // console.log(bidID, contractName);
        try {

        const result = await new progress({
            contract_name: contractName,
            contractor_name: contractorName,
            bid_id: bidID,
            status : status,
            fundUsed : fund,
            imageNames: images
        }).save();

        return true;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }
};
