const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    contract_name: {type: String},
    contractor_name: {type: String},
    bid_id: {type: Number},
    status : { type: String},
    fundUsed : {type: Number},
    imageNames: {type: String}
}, {timestamps: true});

const progress = mongoose.model('progress', progressSchema);

module.exports = progress;