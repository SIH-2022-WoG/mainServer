'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const interestSchema = mongoose.Schema({
    name : {
        type : String,
        unique : true,
        required : true
    },
    description : {
        type : String,
        required : true
    }
});

interestSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('Interest',interestSchema,'interests');
