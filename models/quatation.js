const mongoose = require('mongoose')

const quota = new mongoose.Schema({
    contractor_name: {type: String},
    contract_name: {type : String},
    bid_id: {type: Number},
    isApproved: {type : Boolean, default: false},
    items: [],
    total_amount : {type: Number, default:0}
},{timestamps: true});

const quotation = mongoose.model("quotations", quota);

module.exports = quotation;