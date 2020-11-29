const mongoose  = require('mongoose')
require('../initDB')

let register = new mongoose.Schema({
    name: {type: String},
    password: {type: String}
})

myScheme = mongoose.model('registration', register);
module.exports = myScheme