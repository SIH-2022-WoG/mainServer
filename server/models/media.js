'use strict'
const mongoose = require("mongoose");

/**
 * This is a model to store response received when uploading file via uploader service
 * @property {String} s3Url
 * @property {String} cfUrl
 * @property {String} mediaId
 */
const mediaDetailsSchema = new mongoose.Schema({
    _id: false,
    s3Url: {
        type: String,
        required: [true, "s3Url is required"],
        trim: true
    },
    cfUrl: {
        type: String,
        required: [true, "cfUrl is required"],
        trim: true
    },
    mediaId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "mediaId is required"]
    }
});

module.exports = {
    mediaDetails: mediaDetailsSchema,
}