const mongoose = require('mongoose');

const noty = new mongoose.Schema({
    name : {type: String},
    description: {type: String},

}, {timestamps: true});

const notification = mongoose.model('notification', noty);

module.exports = notification;