const operations = require('./operations');
const Bids = require('../models/bid')

module.exports = {
    bidSection: async (req, res)=> {
        // const allBids = await operations.getAllBids();
        const allBids = await Bids.find();
        res.render('bidSection.ejs', {allBids: allBids});
    },
    approveBid: async(req, res)=> {
        const result = await operations.approveBid(req, res);
        if(result==true) {
            res.json({Success:"Approved"});
        } else {
            res.json({error:"Not Approved"});
        }
    },
    deleteBid: async (req, res)=> {
        const bid = await operations.deleteBid(req, res);
        if(bid== true) {
            return res.status(200).json({success: "Deleted"});
        } else {
            return res.status(400).json({success: "Not Deleted"});
        }
    },
    myScheme: async (req, res)=> {
        const allBids = await Bids.find({contractor_name: req.cookies.user_name});
        console.log(allBids);
        res.render('myScheme', {allBids: allBids})
    },
    addFund : async (req, res)=> {
        try {
            const fund = await operations.addFund(req, res);
            if(fund) {
                const allBids = await Bids.find();
                req.flash('success', 'Fund Added!')
                return res.render('bidSection', {allBids:allBids})
            }
        } catch (error) {
            console.log(error.message);
            req.flash('error', 'Fund Not Added')
            return res.render('bidSection', {allBids:allBids})
        }
    }
}