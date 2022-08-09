'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const collegeDetails = require('../models/college').collegeDetails
const media = require('../models/media').mediaDetails

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
    },
    numThesis : {
        type : Number,
        default : 0
    },
    college : {
        type : collegeDetails,
    },
    avatar : {
        type : media
    },
    description : {
        type : String
    },

}, {
    timestamps : true
});

professorSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('Professor',professorSchema,'professors');
