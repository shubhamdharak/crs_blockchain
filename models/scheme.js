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

let contactQueries = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    mobile:{type:Number},
    query:{type:String},
    isUser:{type:String},
    querySts:{type:String},
    querySolution:{type:String}
},{timestamps:true})

regSchema = mongoose.model('registration', register);
contactSchema = mongoose.model('contactQueries',contactQueries);
module.exports = {regSchema,contactSchema}