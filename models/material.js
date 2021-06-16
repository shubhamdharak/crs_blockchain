const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    material_id: {type: Number},
    name : {type: String},
    cost: {type: String}
}, {timestamps: true});

const material = mongoose.model('materials', materialSchema);

module.exports = material;