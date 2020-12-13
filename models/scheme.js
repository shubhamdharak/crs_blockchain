const mongoose  = require('mongoose')
require('../initDB')

let register = new mongoose.Schema({
    name: {type: String},
    password: {type: String},
    email: {type: String},
    mobile: {type: Number},
    accountType: {type: String},
    age: {type: Number},
    accVerified:{type:Boolean}
},{timestamps:true})

myScheme = mongoose.model('registration', register);
module.exports = myScheme