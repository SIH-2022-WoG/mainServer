'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const professorSchema = mongoose.Schema({

    name : {
        type : String,
        required: true
    },
    phoneNumber : {
        type : String
    },
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        unique : true
    }
}, {
    timestamps : true
});

professorSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('Professor',professorSchema,'professors');
