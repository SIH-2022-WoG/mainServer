'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const studentSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        unique : true
    },
    
},{
    timestamps : true
});

studentSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('student',studentSchema,'students');
