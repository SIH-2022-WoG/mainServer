'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const candidateSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    
});

candidateSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('Candidate',candidateSchema,'candidates');

