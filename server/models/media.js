'use strict';
const mongoose = require('mongoose');
const validators = require('../utils/validators');

/**
 * This is a model to store response received when uploading file via uploader service
 * @property {String} cloudUrl
 * @property {String} mediaId
 */
const mediaDetailsSchema = new mongoose.Schema({
  _id: false,
  cloudUrl: {
    type: String,
    validate: validators.urlValidator,
  },
  mediaId: {
    type: String,
  },
});

module.exports = {
  mediaDetails: mediaDetailsSchema,
};
