const operations = require('./operations');
const Bids = require('../models/bid');
const {regSchema} = require('../models/scheme');
const progress = require('../models/progress');
const Notification = require('../models/notifications');
const Material = require('../models/material');


module.exports = {
    bidSection: async (req, res)=> {
        // const allBids = await operations.getAllBids();
        const allUsers = await regSchema.find();
        const allBids = await Bids.find();
        res.render('bidSection.ejs', {allBids: allBids,allUsers:allUsers});
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
        const allNoty = await Notification.find();
        const allMaterial = await Material.find();
        res.render('myScheme', {allBids: allBids,allNoty:allNoty,allMaterial:allMaterial})
    },
    addFund : async (req, res)=> {
        try {
            const fund = await operations.addFund(req, res);
            if(fund) {
                const allBids = await Bids.find();
                req.flash('success', 'Fund Added!')
                const allUsers = await regSchema.find();
                return res.render('bidSection', {allBids:allBids,allUsers:allUsers})
            }
        } catch (error) {
            console.log(error.message);
            req.flash('error', 'Fund Not Added')
            const allUsers = await regSchema.find();
            return res.render('bidSection', {allBids:allBids,allUsers:allUsers})
        }
    },
    addProgress: async (req, res)=> {
        const result = await operations.addProgress(req, res);
        if(result) {
            const allBids = await Bids.find({contractor_name: req.cookies.user_name});
            const allNoty = await Notification.find();
            const allMaterial = await Material.find();
            return res.render('myScheme', {allBids: allBids,allNoty:allNoty,allMaterial:allMaterial})
        } else {
            const allBids = await Bids.find({contractor_name: req.cookies.user_name});
            const allNoty = await Notification.find();
            const allMaterial = await Material.find();
            return res.render('myScheme', {allBids: allBids,allNoty:allNoty,allMaterial:allMaterial})
        }
    },
    progress: async (req, res)=> {
        const allUsers = await regSchema.find();
        const allProgress = await progress.find();
        const allNoty = await Notification.find();
        const allMaterial = await Material.find();
        return res.render('progress',{allUsers: allUsers, allProgress:allProgress,allNoty:allNoty,allMaterial:allMaterial});
    }
}