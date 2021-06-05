const operations = require('./operations');

module.exports = {
    bidSection: async (req, res)=> {
        const allBids = await operations.getAllBids();
        res.render('bidSection.ejs', {allBids: allBids});
    },
    approveBid: async(req, res)=> {
        const result = await operations.approveBid(req, res);
        if(result==true) {
            res.json({Success:"Approved"});
        } else {
            res.json({error:"Not Approved"});
        }
    }
}