const mongoose = require('mongoose')

const transact = new mongoose.Schema({
    transactionHash : {type: String, required: true},
    blockNumber: {type: String, required: true}
},{timestamps: true})

const Transaction = new mongoose.model('Transaction', transact)

module.exports = Transaction