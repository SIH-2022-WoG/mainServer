'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const collegeSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    
});

collegeSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('College',collegeSchema,'colleges');

