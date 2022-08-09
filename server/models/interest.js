'use strict'

const mongoose = require("mongoose");

const interestDetailsSchema = new mongoose.Schema({
    _id: false,
    name : {
        type : String, 
        required : true
    },
    interestId : {
        type : mongoose.Types.ObjectId,
        required : true
    },
});

module.exports = {
    interestDetails: interestDetailsSchema,
}