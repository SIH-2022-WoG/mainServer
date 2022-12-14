'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validators = require('../utils/validators');
const media = require('../models/media').mediaDetails;
const commonConfig = require('../commonConfig.json');

const collegeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: validators.emailValidator,
    },
    nirfRanking: {
      type: Number,
    },
    numProffEnrolled: {
      type: Number,
      default: 0,
    },
    numStudentsEnrolled: {
      type: Number,
      default: 0,
    },
    numThesis: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    moderatedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'Moderator',
    },
    status: {
      type: String,
      enum: commonConfig.status.values,
      default: commonConfig.status.default,
    },
    collegeDocs: {
      type: [media],
    },
    avatar: {
      type: media,
    },
    logo: {
      type: media,
    },
    website: {
      type: String,
      validate: validators.urlValidator,
    },
  },
  {
    timestamps: true,
  }
);

collegeSchema.plugin(mongoosePaginate);
collegeSchema.index({ name: 'text' });
module.exports = mongoose.mainConnection.model(
  'College',
  collegeSchema,
  'colleges'
);
