'use strict'

const mongoose = require("mongoose");

const collegeDetailsSchema = new mongoose.Schema({
    _id: false,
    name : {
        type : String, 
        required : true
    },
    collegeId : {
        type : mongoose.Types.ObjectId,
        required : true
    }
});

module.exports = {
    collegeDetails: collegeDetailsSchema,
}