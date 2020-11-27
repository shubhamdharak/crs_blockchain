const mongoose  = require('mongoose')
require('../initDB')

const scheme = new mongoose.Schema({
    name: String,
    password: String
})

myScheme = mongoose.model('scheme', scheme);

module.exports = myScheme