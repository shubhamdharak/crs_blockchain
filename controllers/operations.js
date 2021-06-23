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
const Quotation = require('../models/quatation');

let sender =  '0x6bdB4eb9d6a7B3310D4D7d84e4da6A3b7d321eF8'

//  Saves transaction history to database for retriving purpose
async function transaction(req, res, scheme, activity, event) {
    const data = await new Transaction({
        transactionHash : scheme.transactionHash,
        blockNumber : scheme.blockNumber,
        activity: activity,
        event: event
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
            transaction(req, res, scheme, 'Add Scheme', "Addscheme") // Add to transaction  collection
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
                    return true;
                });
            transaction(req, res, result, 'Delete Scheme',"DeleteScheme")
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
            transaction(req, res, result, 'Update Scheme', "UpdateScheme")
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
        const user = req.cookies.user_name;
        try {
            const result = await connection.initContract().methods.addMaterial(name, sender,cost).send({from: sender, gas:3000000})
            const materialCount = await connection.initContract().methods.materialCount().call();
            const mat = await new Material({
                material_id: materialCount,
                name: name,
                cost: cost,
                supplierName: user
            }).save();
            transaction(req, res, result, "Add Material", "AddMaterial");
            const allMaterials = await Material.find();
            const allNoty = await Notification.find();
            const allQuotation = await Quotation.find();
            req.flash("success", "Materal added successfully")
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole,allMaterials:allMaterials, allNoty:allNoty ,allQuotation :allQuotation })

        } catch(error) {
            req.flash('error', 'Something wents wrong')
            console.log(error.message);
            const allNoty = await Notification.find()
            const allMaterials = await Material.find();
            const allQuotation = await Quotation.find();
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole,allNoty:allNoty,allMaterials:allMaterials,allQuotation:allQuotation})
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
                return true;
            });
            transaction(req, res, result, 'Delete Material',"DeleteMaterial")
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

            transaction(req, res, result, "Update Material","UpdateMaterial")
            req.flash("success", "Material updated!")
            const allNoty = await Notification.find();
            const allQuotation = await Quotation.find();
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole, allMaterials:allMaterials,allNoty:allNoty,allQuotation:allQuotation})

        } catch (error) {
            console.log(error.message);
            req.flash('error', 'Updating scheme fails due to errors')
            const allNoty = await Notification.find();
            const allQuotation = await Quotation.find();
            const allMaterials = await connection.initContract().methods.allMaterials().call()
            return  res.render("userDashboard",{isValid:true,userRole:req.session.userRole, allMaterials:allMaterials,allNoty:allNoty,allQuotation:allQuotation})
        }
    },
    myMaterials:async  (req, res)=> {
        const user  = req.cookies.user_name;
        try {
            const allMaterials = await Material.find({supplierName: user});
            const allNoty = await Notification.find();
            const allQuotation = await Quotation.find();
            return res.render('myMaterial', {allMaterials:allMaterials, allNoty:allNoty,allQuotation:allQuotation});
        } catch (error) {
            const allMaterials = await Material.find({supplierName: user});
            const allNoty = await Notification.find();
            const allQuotation = await Quotation.find();
            req.flash('error', 'Something went wrong');
            return res.render('myMaterial', {allMaterials:allMaterials, allNoty:allNoty,allQuotation:allQuotation});
        }
    },
    transactions : async (req, res) => {
        const allTransactions = await Transaction.find()
        const allUsers = await regSchema.find();
        res.render('Transactions', {allTransactions : allTransactions,allUsers:allUsers})
    },
    getTransaction: async (req, res)=> {
        const hash = req.params.hash
        const event = req.params.event
        const data = await global.web3.eth.getTransaction(hash)
        .catch((error=> console.log(error.message)))

        const rec = await connection.initContract().getPastEvents(`${event}`, {fromBlock:0})
	    rec.forEach(event => {
            if(hash == event.transactionHash) {
                return res.status(200).json({data: data, event:event})
            }
            
        });

        // let tx_data = data.input;
        // let input_data = '0x' + tx_data.slice(10);
        // let params = web3.eth.abi.decodeParameters([ 'string', 'string', 'string'], input_data);
        // console.log(params);
    },
    makeBid : async (req, res)=> {
        const { contract_id, bidAmount, contract_name } = req.body
        const userId = req.session.userId;
        let user;
        try {
            user = await regSchema.findOne({_id: userId});
        } catch (error) {
            console.log(error.message);
            req.flash('error', error.message);
        }
        
        // console.log(user.name);
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
                transaction(req, res, bid, "Add Bid","AddBid")
                if(Object.keys(bid.events).length === 0) {
                    Bids.deleteOne({_id: bidDb._id}, function(err) {
                        if(err) {
                            console.log(err.message);
                        }
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
        const { bid_id, contractId, bidAmount,contractor_name} = req.body
        const qt = await Quotation.findOne({bid_id:bid_id})
        if( qt.isApproved==true ) {

            const result = await connection.initContract().methods.allocateContract(contractId, sender, bid_id,contractor_name).send({from: sender, gas:3000000});
            // update isAppoved in db
            try {
            const bid = await  Bids.findOneAndUpdate({bid_id:bid_id},{
                isApprove: true,
                contractor_name:contractor_name 
            }, {new:true})
            transaction(req, res, result, "Approved Bid","AllocateContract");
            return true;
            } catch (error) {
                console.log(error.message);
                return false;
            }
        } else {
            req.flash('error', "Waiting for quotation approval!")
            return false;
        }
    },
    getBid: async (req, res)=> {
        const {contract_id} = req.params
        const bid = await connection.initContract().methods.getABid(contract_id).call();
        return res.status(200).json({bid: bid})
    },
    deleteBid: async (req, res)=> {
        try {
            const {bidId} = req.params
            const bid = await connection.initContract().methods.deleteBid(bidId).send({from:sender});
 
                Bids.deleteOne({bid_id: bidId}, function(err) {
                    if(err) {
                        console.log(err.message);
                        return req.flash("error",err.message);
                    }
                    return true;
                });
                transaction(req, res, bid, "Delete Bid","DeleteBid")
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
            transaction(req, res, fund, "Fund Added","AddFunds")
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
    },
    addQuta: async (req, res)=> {
        const {names, quantity, cost, bidId } = req.body;
        const bid = await Bids.findOne({bid_id: bidId, contractor_name: req.cookies.user_name});
        const allBids = await Bids.find({contractor_name: req.cookies.user_name});
        const allNoty = await Notification.find();
        const allMaterial = await Material.find();
        const allQuotation  = await Quotation.find({contractor_name: req.cookies.user_name});
        if(bid != null) {
            const contract_name = bid.contract_name;
            let quota= [];
            let t_amount=0;
            let qt = [];
            for(let i of quantity) {
                i && qt.push(i);
            }

            names.forEach((elem,ind)=>{
                t_amount += (qt[ind] * cost[ind]);
                quota.push({
                    item_name:elem,
                    quantity : qt[ind]})
            })

            const result = await new Quotation({
                contractor_name: req.cookies.user_name,
                contract_name : contract_name,
                bid_id: bidId,
                items:quota,
                total_amount: t_amount
            }).save(async function(err) {
                if(err) {
                    console.log(err.message);
                    req.flash("error","something went wrong");
                    res.render('myScheme', {allBids: allBids,allNoty:allNoty,allMaterial:allMaterial,allQuotation:allQuotation})
                } else {
                    console.log("saved");
                    req.flash("success","Quotation Send!");
                    return res.render('myScheme', {allBids: allBids,allNoty:allNoty,allMaterial:allMaterial,allQuotation:allQuotation})
                }
            })
        } else {
            req.flash('error', "You are not eligible for scheme , Bid first");
            return res.render('myScheme', {allBids: allBids,allNoty:allNoty,allMaterial:allMaterial,allQuotation:allQuotation})
        }
    
    },
    approveQuota: async (req, res)=> {
        const {approve} = req.body;
        try {
            const result = await Quotation.findOneAndUpdate({_id:approve},{
                isApproved: true
            }, {new:true});
            req.flash('success', "Approved!");
            return res.redirect('/Dashboard');
        } catch (error) {
            console.log(error.message);
            req.flash('error', "something went wrong");
            return res.redirect('/Dashboard');
        }

    }
};
