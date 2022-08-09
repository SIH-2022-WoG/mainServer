'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const user = require('../user/userModel')

const moderatorSchema = mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        unique : true
    }
});

moderatorSchema.plugin(mongoosePaginate);
module.exports = mongoose.mainConnection.model('Moderator',moderatorSchema,'moderators');
