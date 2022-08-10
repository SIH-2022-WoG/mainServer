'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validators = require('../utils/validators');
const media = require('../models/media').mediaDetails;
const collegeConfig = require('./collegeConfig.json');

const collegeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
      type: mongoose.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: collegeConfig.status.values,
      default: collegeConfig.status.default,
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
