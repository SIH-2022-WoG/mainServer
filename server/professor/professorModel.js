'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const collegeDetails = require('../models/college').collegeDetails;
const media = require('../models/media').mediaDetails;
const commonConfig = require('../commonConfig.json');
const thesis = require('../models/thesis').thesisDetailsSchema;

const professorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'professor',
    },
    collegeId: {
      type: mongoose.Types.ObjectId,
      ref: 'College',
    },
    avatar: {
      type: media,
    },
    phoneNumber: {
      type: String,
    },
    designation: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    numThesis: {
      type: Number,
      default: 0,
    },
    currCollege: {
      type: collegeDetails,
    },
    avatar: {
      type: media,
    },
    description: {
      type: String,
    },
    branch: {
      type: String,
      enum: commonConfig.branch.values,
      default: commonConfig.branch.default,
    },
    interests: [{ type: String, trim: true }],
    pastColleges: {
      type: collegeDetails,
    },
    theses: [{ type: thesis }],
    status: {
      type: String,
      enum: commonConfig.status.values,
      default: commonConfig.status.default,
    },
    moderatedBy: {
      type: mongoose.Types.ObjectId,
    },
    iDproof: {
      type: media,
    },
    rejectionInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

professorSchema.plugin(mongoosePaginate);
professorSchema.index({ branch: 1, interests: 1, collegeId: 1 });
professorSchema.index({ name: 'text' });
module.exports = mongoose.mainConnection.model(
  'Professor',
  professorSchema,
  'professors'
);
