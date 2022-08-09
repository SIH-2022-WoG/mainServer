'use strict'

const mongoose = require("mongoose");
const validators = require('../utils/validators')


const profDetailsSchema = new mongoose.Schema({
    _id: false,
    name : {
        type : String, 
        required : true
    },
    profId : {
        type : mongoose.Types.ObjectId,
        required : true
    },
    email : {
        type : String,
        validate : validators.emailValidator
    },
});

module.exports = {
    profDetails: profDetailsSchema,
}