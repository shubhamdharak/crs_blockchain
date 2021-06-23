const mongoose = require('mongoose')

const transact = new mongoose.Schema({
    transactionHash : {type: String, required: true},
    blockNumber: {type: String, required: true},
    activity : {type: String},
    event: {type: String}
},{timestamps: true})

const Transaction = new mongoose.model('Transaction', transact)

module.exports = Transaction