'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const professorSchema = mongoose.Schema({
    
});

professorSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('Professor',professorSchema,'professors');
