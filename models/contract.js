const mongoose = require('mongoose');

const contractScheme = new mongoose.Schema({
    contract_id : {type: Number},
    contract_name : {type: String},
    description : {type: String},
    date: {type: String},
    address :{type: String},
    cost : {type: Number},
    path : {type: String},
    isAllocated : {type: Boolean, default:false}
},{timestamps: true});

const contract = mongoose.model('schemes', contractScheme);
module.exports = contract;