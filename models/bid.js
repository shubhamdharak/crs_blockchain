const mongoose  = require('mongoose')
require('../initDB')

const bid = new mongoose.Schema({
    bid_id : {type: Number },
    bid_amount: {type: Number },
    contract_id: {type : Number},
    contract_name: {type: String},
    contractor : {type: String},
    contractor_name: {type: String},
    isApprove: {type: Boolean, default: false}
},{timestamps:true});

Bids = mongoose.model('bids', bid);

module.exports = Bids;