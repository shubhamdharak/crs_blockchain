const mongoose = require('mongoose');

const fund = new mongoose.Schema({
    fund_id : {type: Number},
    contract_id : {type: Number},
    contractor_name : {type: String},
    bid_id : {type: Number},
    amount : { type: Number},
    isAllocated : {type : Boolean}
}, {timestamps: true});

const fundSchema = mongoose.model('funds',fund);

module.exports = fundSchema;